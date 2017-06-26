## 3.3 Garbage Collection of Remote Objects

## Remote Object 的垃圾回收

In a distributed system, just as in the local system, it is desirable to automatically delete those remote objects that are no longer referenced by any client. This frees the programmer from needing to keep track of the remote objects' clients so that it can terminate appropriately. RMI uses a reference-counting garbage collection algorithm similar to Modula-3's Network Objects. (See "Network Objects" by Birrell, Nelson, and Owicki,  Digital Equipment Corporation Systems Research Center Technical Report 115, 1994.)

分布式系统, 和单机系统类似, 也需要自动删除那些不再被任何客户端引用的远程对象. 这解放了程序员, 不需要手动跟踪客户端使用的远程对象了. RMI使用的是 引用计数算法, 和 Modula-3's Network Objects 很相似.(详情请参考 "Network Objects" by Birrell, Nelson, and Owicki,  Digital Equipment Corporation Systems Research Center Technical Report 115, 1994.)


To accomplish reference-counting garbage collection, the RMI runtime keeps track of all live references within each Java virtual machine. When a live reference enters a Java virtual machine, its reference count is incremented. The first reference to an object sends a "referenced" message to the server for the object. As live references are found to be unreferenced in the local virtual machine, the count is decremented. When the last reference has been discarded, an unreferenced message is sent to the server. Many subtleties exist in the protocol; most of these are related to maintaining the ordering of referenced and unreferenced messages in order to ensure that the object is not prematurely collected.

为了实现引用计数算法, RMI 运行时在每个JVM 中跟踪所有存活的对象引用. 当一个存活引用进入 JVM, 它的引用次数增加 1。对某个对象的第一次引用, 会向服务器发送一个 "referenced" 消息. 如果在本地JVM中发现某个引用释放, 则次数减 1。当最后一个引用被丢弃, 会向服务器发送一个 "unreferenced" 消息.  协议中存在许多微妙之处; 大多数消息都是处理 referenced and unreferenced 消息的, 目的是确保对象不会被过早地回收。


When a remote object is not referenced by any client, the RMI runtime refers to it using a weak reference. The weak reference allows the Java virtual machine's garbage collector to discard the object if no other local references to the object exist. The distributed garbage collection algorithm interacts with the local Java virtual machine's garbage collector in the usual ways by holding normal or weak references to objects.

当一个 remote object 不被任何客户端所引用时, RMI运行时会通过弱引用来指向它. 假如没有其他的强引用, JVM 在垃圾收集器时可能会将弱引用丢弃.  分布式垃圾收集算法与单机JVM的垃圾收集器通过正常的/或者弱引用的方式进行交互。


As long as a local reference to a remote object exists, it cannot be garbage-collected and it can be passed in remote calls or returned to clients. Passing a remote object adds the identifier for the virtual machine to which it was passed to the referenced set. A remote object needing unreferenced notification must implement the`java.rmi.server.Unreferenced` interface. When those references no longer exist, the `unreferenced` method will be invoked. `unreferenced` is called when the set of references is found to be empty so it might be called more than once. Remote objects are only collected when no more references, either local or remote, still exist.

只要客户端引用还存在, 就不能回收服务器中的远程对象, 因为还可能会进行远程调用, 或者返回给客户端. 传递给JVM的远程对象会添加到 referenced set 中。 需要 unreferenced 通知的远程对象, 必须实现 `java.rmi.server.Unreferenced` 接口。 当这些引用不再存在, 就会调用对应的 `unreferenced`方法。`unreferenced` 方法可能会被调用多次, 只要客户端发现 references set 是空的就会执行。远程对象只有当客户端和服务端都不存在引用时才会被回收。


Note that if a network partition exists between a client and a remote server object, it is possible that premature collection of the remote object will occur (since the transport might believe that the client crashed). Because of the possibility of premature collection, remote references cannot guarantee referential integrity; in other words, it is always possible that a remote reference may in fact not refer to an existing object. An attempt to use such a reference will generate a `RemoteException` which must be handled by the application.

注意, 如果在客户端和远程服务器之间存在网络分割(network partition), 可能会发生过早回收(因为网络不通, 可能会认为客户端已经崩溃了). 因为可能会发生过早回收(premature collection), 远程引用也就不能保证引用的完整性; 换句话说, 可能某个 remote reference 指向的对象已经不存在了。使用这种引用将会抛出 `RemoteException` 异常, 必须由程序进行捕获处理。








原文链接: [https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html](https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html)





