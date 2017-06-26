## 3.3 Garbage Collection of Remote Objects

## Remote Object 的垃圾回收

In a distributed system, just as in the local system, it is desirable to automatically delete those remote objects that are no longer referenced by any client. This frees the programmer from needing to keep track of the remote objects' clients so that it can terminate appropriately. RMI uses a reference-counting garbage collection algorithm similar to Modula-3's Network Objects. (See "Network Objects" by Birrell, Nelson, and Owicki,  Digital Equipment Corporation Systems Research Center Technical Report 115, 1994.)

在分布式系统中,就像在本地系统,需要自动删除那些不再的远程对象引用的任何客户机.这使程序员从远程对象需要跟踪的客户,这样就可以适当地终止.RMI使用引用计数Modula-3垃圾收集算法相似的网络对象.(见“网络对象”,博雷尔纳尔逊和Owicki,数字设备公司系统研究中心技术报告115年,1994年)。


To accomplish reference-counting garbage collection, the RMI runtime keeps track of all live references within each Java virtual machine. When a live reference enters a Java virtual machine, its reference count is incremented. The first reference to an object sends a "referenced" message to the server for the object. As live references are found to be unreferenced in the local virtual machine, the count is decremented. When the last reference has been discarded, an unreferenced message is sent to the server. Many subtleties exist in the protocol; most of these are related to maintaining the ordering of referenced and unreferenced messages in order to ensure that the object is not prematurely collected.

为了实现引用计数的垃圾收集,RMI运行时跟踪都生活在每个Java虚拟机的引用.当一个住参考输入Java虚拟机,它的引用计数增加。第一个引用一个对象向服务器发送一个“引用”消息的对象.在生活中发现未引用引用本地虚拟机,计数递减。当最后一个引用已经被弃用,一个未引用的消息发送到服务器.协议中存在许多微妙之处;大多数的相关维护引用的顺序和未引用的消息,以确保对象不是过早地收集。


When a remote object is not referenced by any client, the RMI runtime refers to it using a weak reference. The weak reference allows the Java virtual machine's garbage collector to discard the object if no other local references to the object exist. The distributed garbage collection algorithm interacts with the local Java virtual machine's garbage collector in the usual ways by holding normal or weak references to objects.

当一个远程对象没有引用任何客户端,RMI运行时使用弱引用是指它.弱引用允许Java虚拟机的垃圾收集器丢弃对象如果没有其他本地引用对象存在.分布式垃圾收集算法与本地Java虚拟机的垃圾收集器以通常的方式正常或对象的弱引用。


As long as a local reference to a remote object exists, it cannot be garbage-collected and it can be passed in remote calls or returned to clients. Passing a remote object adds the identifier for the virtual machine to which it was passed to the referenced set. A remote object needing unreferenced notification must implement the`java.rmi.server.Unreferenced` interface. When those references no longer exist, the `unreferenced` method will be invoked. `unreferenced` is called when the set of references is found to be empty so it might be called more than once. Remote objects are only collected when no more references, either local or remote, still exist.

只要当地一个远程对象引用的存在,它不能被垃圾收集可以远程调用中传递或返回给客户端.通过远程对象添加了标识符的虚拟机是通过引用集。需要未引用通知必须实现的远程对象`java.rmi.server.Unreferenced`接口。当这些引用不再存在,`unreferenced`方法将被调用。`unreferenced`时调用的引用集发现是空的也不止一次。远程对象只是收集不再引用时,无论是本地或远程,仍然存在。


Note that if a network partition exists between a client and a remote server object, it is possible that premature collection of the remote object will occur (since the transport might believe that the client crashed). Because of the possibility of premature collection, remote references cannot guarantee referential integrity; in other words, it is always possible that a remote reference may in fact not refer to an existing object. An attempt to use such a reference will generate a `RemoteException` which must be handled by the application.

注意,如果一个网络分区之间存在一个客户端和一个远程服务器对象,可能会发生过早远程对象的集合(因为运输可能相信客户端崩溃).因为过早集合的可能性,不能保证远程引用引用完整性;换句话说,它总是一个远程引用可能事实上不是指现有对象。试图用这样的引用将生成一个`RemoteException`必须由应用程序来处理。








原文链接: [https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html](https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html)





