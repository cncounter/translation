# Java Debug Wire Protocol

＃JDWP协议规范


## Overview

The Java Debug Wire Protocol (JDWP) is the protocol used for communication between a debugger and the Java virtual machine (VM) which it debugs (hereafter called the target VM). JDWP is optional; it might not be available in some implementations of the JDK. The existence of JDWP can allow the same debugger to work

- in a different process on the same computer, or
- on a remote computer,

The JDWP differs from many protocol specifications in that it only details format and layout, not transport. A JDWP implementation can be designed to accept different transport mechanisms through a simple API. A particular transport does not necessarily support each of the debugger/target VM combinations listed above.

The JDWP is designed to be simple enough for easy implementation, yet it is flexible enough for future growth.

Currently, the JDWP does not specify any mechanism for transport rendezvous or any directory services. This may be changed in the future, but it may be addressed in a separate document.

JDWP is one layer within the Java Platform Debugger Architecture (JPDA). This architecture also contains the higher-level Java Debug Interface (JDI). The JDWP is designed to facilitate efficient use by the JDI; many of its abilities are tailored to that end. The JDI is more appropriate than JDWP for many debugger tools, particularly those written in the Java programming language. For more information on the Java Platform Debugger Architecture, see the [Java Platform Debugger Architecture documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/index.html) for this release.

##概述

`JDWP` 全称是 `Java Debug Wire Protocol`, 中文翻译为 `Java调试线协议`, 是用于规范 调试器（debugger）与目标JVM之间通信的协议。
JDWP是一个可选组件；可能在某些JDK实现中不可用。

JDWP支持两种调试场景：

- 同一台计算机上的其他进程
- 远程计算机上

与许多协议规范的不同之处在于，JDWP只规定了具体的格式和布局，而不管你用什么协议来传输数据。
JDWP实现可以只使用简单的API来接受不同的传输机制。 具体的传输不一定支持各种组合。

JDWP设计得非常简洁，容易实现， 而且对于未来的升级也足够灵活。

当前，JDWP 没有指定任何传输机制。 将来如果发生变更，会在单独的文档中来进行规范。

JDWP 是 JPDA 中的一层。 JPDA(Java Platform Debugger Architecture, Java平台调试器体系结构) 架构还包含更上层的Java调试接口（JDI， Java Debug Interface）。 JDWP旨在促进JDI的有效使用； 为此，它的许多功能都是量身定制的。
对于那些用Java语言编写的Debugger工具来说，直接使用JDI比起JDWP更加方便。
有关 JPDA 的更多信息，请参考: [Java Platform Debugger Architecture documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/index.html)。


## JDWP Start Up

After the transport connection is established and before any packets are sent, a handshake occurs between the two sides of the connection:

The handshake process has the following steps:

- The debugger side sends 14 bytes to the VM side, consisting of the 14 ASCII characters of the string "JDWP-Handshake".
- The VM side replies with the same 14 bytes: JDWP-Handshake

## JDWP握手过程

连接建立之后，在发送其他数据包之前，连接双方需要进行握手：

握手过程包括以下步骤：

- debugger 端向目标 JVM 发送14个字节，也就是包括14个ASCII字符的字符串 "JDWP-Handshake" 。
- VM端以相同的14个字节答复：JDWP-Handshake

## JDWP Packets

The JDWP is packet based and is not stateful. There are two basic packet types: command packets and reply packets.

Command packets may be sent by either the debugger or the target VM. They are used by the debugger to request information from the target VM, or to control program execution. Command packets are sent by the target VM to notify the debugger of some event in the target VM such as a breakpoint or exception.

A reply packet is sent only in response to a command packet and always provides information success or failure of the command. Reply packets may also carry data requested in the command (for example, the value of a field or variable). Currently, events sent from the target VM do not require a response packet from the debugger.

The JDWP is asynchronous; multiple command packets may be sent before the first reply packet is received.

Command and reply packet headers are equal in size; this is to make transports easier to implement and abstract. The layout of each packet looks like this:

- Command Packet

  - Header
    - length (4 bytes)
    - id (4 bytes)
    - flags (1 byte)
    - command set (1 byte)
    - command (1 byte)
  - data (Variable)

- Reply Packet
  - Header
    - length (4 bytes)
    - id (4 bytes)
    - flags (1 byte)
    - error code (2 bytes)
  - data (Variable)

All fields and data sent via JDWP should be in big-endian format. (See the Java Virtual Machine Specification for the definition of big-endian.) The first three fields are identical in both packet types.

## JDWP数据包

JDWP是无状态的协议， 基于数据包来传输数据。 包含两种基本的数据包类型：命令包(command packet)和应答包(reply packet)。

调试器和目标VM都可以发出命令包。 调试器可以用命令包来从目标VM请求相关信息或者控制程序的执行。
目标VM可以将自身的某些事件（例如断点或异常）用命令数据包的方式通知调试器。

应答包仅用于对命令包进行响应，并且标明该命令是成功还是失败。
应答包还可以携带命令中请求的数据（例如，字段或变量的值）。 当前，从目标VM发出的事件不需要调试器的应答。

JDWP是异步的； 在收到某个应答之前，可以发送多个命令包。

命令包和应答包的 header 大小相等。 这样使传输更易于实现和抽象。 每个数据包的布局如下所示：

> 命令包（Command Packet）

- Header
  - length (4 bytes)
  - id (4 bytes)
  - flags (1 byte)
  - command set (1 byte)
  - command (1 byte)
- data (长度不固定)

  标头长度（4个字节）id（4个字节）标志（1个字节）命令集（1个字节）命令（1个字节）数据（变量）

> 应答包（Reply Packet）

- Header
  - length (4 bytes)
  - id (4 bytes)
  - flags (1 byte)
  - error code (2 bytes)
- data (Variable)

可以看到， 这两种数据包的Header中， 前三个字段格式是相同的。

通过JDWP发送的所有字段和数据都应采用大端字节序(big-endian)。 （大端字节序的定义请参考《Java虚拟机规范》

### Command and Reply Packet Fields

### 数据包字段说明

#### Shared Header Fields

#### 通用 Header 字段

下面的header字段是命令包与应答包通用的。

- `length`

  The length field is the size, in bytes, of the entire packet, including the length field. The header size is 11 bytes, so a packet with no data would set this field to 11.

  `length` 字段表示整个数据包（包括header）的字节数。 因为数据包 header 的大小为11个字节， 因此没有data的数据包会将此字段值设置为`11`。

- `id`

  The id field is used to uniquely identify each packet command/reply pair. A reply packet has the same id as the command packet to which it replies. This allows asynchronous commands and replies to be matched. The id field must be unique among all outstanding commands sent from one source. (Outstanding commands originating from the debugger may use the same id as outstanding commands originating from the target VM.) Other than that, there are no requirements on the allocation of id's.A simple monotonic counter should be adequate for most implementations. It will allow 2^32 unique outstanding packets and is the simplest implementation alternative.

  `id` 字段用于唯一标识每一对数据包(command/reply)。 应答包id值必须与对应的命令包ID相同。 这样异步方式的命令和应答就能匹配起来。 同一个来源发送的所有未完成命令包的id字段必须唯一。 （调试器发出的命令包, 与JVM发出的命令包如果ID相同也没关系。） 除此之外，对ID的分配没有任何要求。 对于大多数实现而言，使用自增计数器就足够了。  id的取值允许 `2^32`个数据包，足以应对各种调试场景。

- flags

  Flags are used to alter how any command is queued and processed and to tag command packets that originate from the target VM. There is currently one flag bits defined; future versions of the protocol may define additional flags.`0x80` Reply packet The reply bit, when set, indicates that this packet is a reply.

  `flags` 标志用于修改命令的排队和处理方式， 也用来标记源自JVM的数据包。 当前只定义了一个标志位 `0x80`, 表示此数据包是应答包。 协议的未来版本可能会定义其他标志。

#### Command Packet Header Fields

#### 命令包的 Header

除了前面的 通用 Header 字段， 命令包还有以下请求头:

- `command set`

  This field is useful as a means for grouping commands in a meaningful way. The Sun defined command sets are used to group commands by the interfaces they support in the JDI. For example, all commands that support the JDI VirtualMachine interface are grouped in a VirtualMachine command set.The command set space is roughly divided as follows:`0 - 63`Sets of commands sent to the target VM`64 - 127`Sets of commands sent to the debugger`128 - 256`Vendor-defined commands and extensions.

  该字段主要用于通过一种有意义的方式对命令进行分组。 Sun定义的命令集， 通过在JDI 中支持的接口进行分组。 例如，所有支持 `VirtualMachine` 接口的命令都在 `VirtualMachine` 命令集里面。 命令集空间大致分为以下几类：

  - `0-63` 发给目标VM的命令集
  - `64-127` 发送给调试器的命令集
  - `128-256` JVM提供商自己定义的命令和扩展。

- command

  This field identifies a particular command in a command set. This field, together with the command set field, is used to indicate how the command packet should be processed. More succinctly, they tell the receiver what to do. Specific commands are presented later in this document.

  该字段用于标识命令集中的具体命令。 该字段与命令集字段一起用于指示应如何处理命令包。  更简洁地说，它们告诉接收者该怎么做。 具体命令将在本文档后面介绍。

#### Reply Packet Header Fields

#### 应答包的 Header

除了前面的 通用 Header 字段， 应答包还有以下请求头:

- error code

  This field is used to indicate if the command packet that is being replied too was successfully processed. A value of zero indicates success, a non-zero value indicates an error. The error code returned may be specific to each command set/command, but it is often mapped to a JVM TI error code.

  此字段用于标识是否成功处理了对应的命令包。 0值表示成功，非零值表示错误。 返回的错误代码由具体的命令集/命令规定， 但是通常会映射为 JVM TI 标准错误码。

#### Data

The data field is unique to each command set/command. It is also different between command and reply packet pairs. For example, a command packet that requests a field value will contain references to the object and field id's for the desired value in its data field. The reply packet's data field will contain the value of the field.

每个命令的 data 部分都是不同的。 相应的命令包和应答包之间也有所不同。  例如，请求命令包希望获取某个字段的值, 可以在data中填上 object ID 和 field ID。 应答包的data字段将存放该字段的值。

## Detailed Command Information

In general, the data field of a command or reply packet is an abstraction of a group of multiple fields that define the command or reply data. Each subfield of a data field is encoded in big endian (Java) format. The detailed composition of data fields for each command and its reply are described in this section.



There is a small set of common data types that are common to many of the different JDWP commands and replies. They are described below.


## 详细的命令信息

通常，命令或应答包的 data 字段格式由具体的命令规定。 data中的每个字段都是（Java标准的）大端格式编码。  下面介绍每个data字段的数据类型。


大部分 JDWP 数据包中的数据类型如下所述。



| Name              | Size                                          |
| ----------------- | --------------------------------------------- |
| `byte`            | 1 byte                                        |
| `boolean`         | 1 byte                                        |
| `int`             | 4 bytes                                       |
| `long`            | 8 bytes                                       |
| `objectID`        | 由具体的JVM确定, 最多 8 字节 |
| `tagged-objectID` | objectID的大小+1字节                |
| `threadID`        | 同objectID                             |
| `threadGroupID`   | 同objectID                             |
| `stringID`        | 同objectID                             |
| `classLoaderID`   | 同objectID                             |
| `classObjectID`   | 同objectID                             |
| `arrayID`         | 同objectID                             |
| `referenceTypeID` | 同objectID                             |
| `classID`         | 同referenceTypeID                       |
| `interfaceID`     | 同referenceTypeID                       |
| `arrayTypeID`     | 同referenceTypeID                       |
| `methodID`        | 由具体的JVM确定, 最多 8 字节 |
| `fieldID`         | 由具体的JVM确定, 最多 8 字节 |
| `frameID`         | 由具体的JVM确定, 最多 8 字节 |
| `location`        | 由具体的JVM确定                           |
| `string`          | 长度不固定                                      |
| `value`           | 长度不固定                                      |
| `untagged-value`  | 长度不固定                                      |
| `arrayregion`     | 长度不固定                                      |



Object ids, reference type ids, field ids, method ids, and frame ids may be sized differently in different target VM implementations. Typically, their sizes correspond to size of the native identifiers used for these items in JNI and JVMDI calls. The maximum size of any of these types is 8 bytes. The "idSizes" command in the VirtualMachine command set is used by the debugger to determine the size of each of these types.

If a debuggee receives a Command Packet with a non-implemented or non-recognized command set or command then it returns a Reply Packet with the error code field set to NOT_IMPLEMENTED (see [Error Constants](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Error)).

不同的JVM中，Object ids, reference type ids, field ids, method ids, and frame ids 的大小可能不同。
通常，它们的大小与JNI和JVMDI调用中用于这些项目的 native 标识符的大小相对应。  这些类型中最大的size为8个字节。
当然, 调试器可以使用 "idSizes" 这个命令来确定每种类型的大小。

如果JVM收到的命令包里面含有未实现(non-implemented)或无法识别(non-recognized)的命令/命令集，则会返回带有错误码 NOT_IMPLEMENTED 的应答包。具体的错误常量可参考: Error Constants](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html#JDWP_Error)。

[JDWP协议的具体内容](https://docs.oracle.com/javase/8/docs/platform/jpda/jdwp/jdwp-protocol.html)

[Java Platform Debugger Architecture (JPDA)](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/index.html)


原文链接: https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/jdwp-spec.html
