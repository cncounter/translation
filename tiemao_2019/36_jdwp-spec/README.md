# Java Debug Wire Protocol

## Overview

The Java Debug Wire Protocol (JDWP) is the protocol used for communication between a debugger and the Java virtual machine (VM) which it debugs (hereafter called the target VM). JDWP is optional; it might not be available in some implementations of the JDK. The existence of JDWP can allow the same debugger to work

- in a different process on the same computer, or
- on a remote computer,

The JDWP differs from many protocol specifications in that it only details format and layout, not transport. A JDWP implementation can be designed to accept different transport mechanisms through a simple API. A particular transport does not necessarily support each of the debugger/target VM combinations listed above.

The JDWP is designed to be simple enough for easy implementation, yet it is flexible enough for future growth.

Currently, the JDWP does not specify any mechanism for transport rendezvous or any directory services. This may be changed in the future, but it may be addressed in a separate document.

JDWP is one layer within the Java Platform Debugger Architecture (JPDA). This architecture also contains the higher-level Java Debug Interface (JDI). The JDWP is designed to facilitate efficient use by the JDI; many of its abilities are tailored to that end. The JDI is more appropriate than JDWP for many debugger tools, particularly those written in the Java programming language. For more information on the Java Platform Debugger Architecture, see the [Java Platform Debugger Architecture documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/index.html) for this release.

## JDWP Start Up

After the transport connection is established and before any packets are sent, a handshake occurs between the two sides of the connection:

The handshake process has the following steps:

- The debugger side sends 14 bytes to the VM side, consisting of the 14 ASCII characters of the string "JDWP-Handshake".
- The VM side replies with the same 14 bytes: JDWP-Handshake

## JDWP Packets

The JDWP is packet based and is not stateful. There are two basic packet types: command packets and reply packets.

Command packets may be sent by either the debugger or the target VM. They are used by the debugger to request information from the target VM, or to control program execution. Command packets are sent by the target VM to notify the debugger of some event in the target VM such as a breakpoint or exception.

A reply packet is sent only in response to a command packet and always provides information success or failure of the command. Reply packets may also carry data requested in the command (for example, the value of a field or variable). Currently, events sent from the target VM do not require a response packet from the debugger.

The JDWP is asynchronous; multiple command packets may be sent before the first reply packet is received.

Command and reply packet headers are equal in size; this is to make transports easier to implement and abstract. The layout of each packet looks like this:

- Command Packet

  Headerlength (4 bytes)id (4 bytes)flags (1 byte)command set (1 byte)command (1 byte)data (Variable)

- Reply Packet

  Headerlength (4 bytes)id (4 bytes)flags (1 byte)error code (2 bytes)data (Variable)

All fields and data sent via JDWP should be in big-endian format. (See the Java Virtual Machine Specification for the definition of big-endian.) The first three fields are identical in both packet types.

### Command and Reply Packet Fields

#### Shared Header Fields

- length

  The length field is the size, in bytes, of the entire packet, including the length field. The header size is 11 bytes, so a packet with no data would set this field to 11.

- id

  The id field is used to uniquely identify each packet command/reply pair. A reply packet has the same id as the command packet to which it replies. This allows asynchronous commands and replies to be matched. The id field must be unique among all outstanding commands sent from one source. (Outstanding commands originating from the debugger may use the same id as outstanding commands originating from the target VM.) Other than that, there are no requirements on the allocation of id's.A simple monotonic counter should be adequate for most implementations. It will allow 2^32 unique outstanding packets and is the simplest implementation alternative.

- flags

  Flags are used to alter how any command is queued and processed and to tag command packets that originate from the target VM. There is currently one flag bits defined; future versions of the protocol may define additional flags.`0x80`Reply packetThe reply bit, when set, indicates that this packet is a reply.

#### Command Packet Header Fields

- command set

  This field is useful as a means for grouping commands in a meaningful way. The Sun defined command sets are used to group commands by the interfaces they support in the JDI. For example, all commands that support the JDI VirtualMachine interface are grouped in a VirtualMachine command set.The command set space is roughly divided as follows:`0 - 63`Sets of commands sent to the target VM`64 - 127`Sets of commands sent to the debugger`128 - 256`Vendor-defined commands and extensions.

- command

  This field identifies a particular command in a command set. This field, together with the command set field, is used to indicate how the command packet should be processed. More succinctly, they tell the receiver what to do. Specific commands are presented later in this document.

#### Reply Packet Header Fields

- error code

  This field is used to indicate if the command packet that is being replied too was successfully processed. A value of zero indicates success, a non-zero value indicates an error. The error code returned may be specific to each command set/command, but it is often mapped to a JVM TI error code.

#### Data

- The data field is unique to each command set/command. It is also different between command and reply packet pairs. For example, a command packet that requests a field value will contain references to the object and field id's for the desired value in its data field. The reply packet's data field will contain the value of the field.

## Detailed Command Information

In general, the data field of a command or reply packet is an abstraction of a group of multiple fields that define the command or reply data. Each subfield of a data field is encoded in big endian (Java) format. The detailed composition of data fields for each command and its reply are described in this section.

There is a small set of common data types that are common to many of the different JDWP commands and replies. They are described below.

| Name              | Size                                          | Description                                                  |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `byte`            | 1 byte                                        | A byte value.                                                |
| `boolean`         | 1 byte                                        | A boolean value, encoded as 0 for false and non-zero for true. |
| `int`             | 4 bytes                                       | An four-byte integer value. The integer is signed unless explicitly stated to be unsigned. |
| `long`            | 8 bytes                                       | An eight-byte integer value. The value is signed unless explicitly stated to be unsigned. |
| `objectID`        | Target VM-specific, up to 8 bytes (see below) | Uniquely identifies an object in the target VM. A particular object will be identified by exactly one objectID in JDWP commands and replies throughout its lifetime (or until the objectID is explicitly disposed). An ObjectID is not reused to identify a different object unless it has been explicitly [disposed](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_VirtualMachine_Dispose), regardless of whether the referenced object has been garbage collected. An objectID of 0 represents a null object.Note that the existence of an object ID does not prevent the garbage collection of the object. Any attempt to access a a garbage collected object with its object ID will result in the INVALID_OBJECT error code. Garbage collection can be disabled with the [DisableCollection](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_ObjectReference_DisableCollection) command, but it is not usually necessary to do so. |
| `tagged-objectID` | size of objectID plus one byte                | The first byte is a signature byte which is used to identify the object's type. See [JDWP.Tag](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Tag) for the possible values of this byte (note that only object tags, not primitive tags, may be used). It is followed immediately by the objectID itself. |
| `threadID`        | same as objectID                              | Uniquely identifies an object in the target VM that is known to be a thread |
| `threadGroupID`   | same as objectID                              | Uniquely identifies an object in the target VM that is known to be a thread group |
| `stringID`        | same as objectID                              | Uniquely identifies an object in the target VM that is known to be a string object. Note: this is very different from string, which is a value. |
| `classLoaderID`   | same as objectID                              | Uniquely identifies an object in the target VM that is known to be a class loader object |
| `classObjectID`   | same as objectID                              | Uniquely identifies an object in the target VM that is known to be a class object. |
| `arrayID`         | same as objectID                              | Uniquely identifies an object in the target VM that is known to be an array. |
| `referenceTypeID` | same as objectID                              | Uniquely identifies a reference type in the target VM. It should not be assumed that for a particular class, the `classObjectID` and the `referenceTypeID` are the same. A particular reference type will be identified by exactly one ID in JDWP commands and replies throughout its lifetime A referenceTypeID is not reused to identify a different reference type, regardless of whether the referenced class has been unloaded. |
| `classID`         | same as referenceTypeID                       | Uniquely identifies a reference type in the target VM that is known to be a class type. |
| `interfaceID`     | same as referenceTypeID                       | Uniquely identifies a reference type in the target VM that is known to be an interface type. |
| `arrayTypeID`     | same as referenceTypeID                       | Uniquely identifies a reference type in the target VM that is known to be an array type. |
| `methodID`        | Target VM-specific, up to 8 bytes (see below) | Uniquely identifies a method in some class in the target VM. The methodID must uniquely identify the method within its class/interface or any of its subclasses/subinterfaces/implementors. A methodID is not necessarily unique on its own; it is always paired with a referenceTypeID to uniquely identify one method. The referenceTypeID can identify either the declaring type of the method or a subtype. |
| `fieldID`         | Target VM-specific, up to 8 bytes (see below) | Uniquely identifies a field in some class in the target VM. The fieldID must uniquely identify the field within its class/interface or any of its subclasses/subinterfaces/implementors. A fieldID is not necessarily unique on its own; it is always paired with a referenceTypeID to uniquely identify one field. The referenceTypeID can identify either the declaring type of the field or a subtype. |
| `frameID`         | Target VM-specific, up to 8 bytes (see below) | Uniquely identifies a frame in the target VM. The frameID must uniquely identify the frame within the entire VM (not only within a given thread). The frameID need only be valid during the time its thread is suspended. |
| `location`        | Target VM specific                            | An executable location. The location is identified by one byte [type tag](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_TypeTag) followed by a a `classID` followed by a `methodID` followed by an unsigned eight-byte index, which identifies the location within the method. Index values are restricted as follows:The index of the start location for the method is less than all other locations in the method.The index of the end location for the method is greater than all other locations in the method.If a line number table exists for a method, locations that belong to a particular line must fall between the line's location index and the location index of the next line in the table.Index values within a method are monotonically increasing from the first executable point in the method to the last. For many implementations, each byte-code instruction in the method has its own index, but this is not required.The type tag is necessary to identify whether location's classID identifies a class or an interface. Almost all locations are within classes, but it is possible to have executable code in the static initializer of an interface. |
| `string`          | Variable                                      | A UTF-8 encoded string, not zero terminated, preceded by a four-byte integer length. |
| `value`           | Variable                                      | A value retrieved from the target VM. The first byte is a signature byte which is used to identify the type. See [JDWP.Tag](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Tag) for the possible values of this byte. It is followed immediately by the value itself. This value can be an objectID (see Get ID Sizes) or a primitive value (1 to 8 bytes). More details about each value type can be found in the next table. |
| `untagged-value`  | Variable                                      | A `value` as described above without the signature byte. This form is used when the signature information can be determined from context. |
| `arrayregion`     | Variable                                      | A compact representation of values used with some array operations. The first byte is a signature byte which is used to identify the type. See [JDWP.Tag](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Tag) for the possible values of this byte. Next is a four-byte integer indicating the number of values in the sequence. This is followed by the values themselves: Primitive values are encoded as a sequence of `untagged-values`; Object values are encoded as a sequence of `values`. |

Object ids, reference type ids, field ids, method ids, and frame ids may be sized differently in different target VM implementations. Typically, their sizes correspond to size of the native identifiers used for these items in JNI and JVMDI calls. The maximum size of any of these types is 8 bytes. The "idSizes" command in the VirtualMachine command set is used by the debugger to determine the size of each of these types.

If a debuggee receives a Command Packet with a non-implemented or non-recognized command set or command then it returns a Reply Packet with the error code field set to NOT_IMPLEMENTED (see [Error Constants](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Error)).

[Protocol details](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html)



https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/jdwp-spec.html
