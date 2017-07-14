## 3.3 Garbage Collection of Remote Objects

## RMI垃圾回收简介

In a distributed system, just as in the local system, it is desirable to automatically delete those remote objects that are no longer referenced by any client. This frees the programmer from needing to keep track of the remote objects' clients so that it can terminate appropriately. RMI uses a reference-counting garbage collection algorithm similar to Modula-3's Network Objects. (See "Network Objects" by Birrell, Nelson, and Owicki,  Digital Equipment Corporation Systems Research Center Technical Report 115, 1994.)

和单机系统类似, 分布式系统也需要自动清除不再有客户端引用的对象(remote object)。 远程对象的自动垃圾回收机制, 将程序员从深坑中解放出来, 不再需要人工跟踪client所引用的对象了. RMI的垃圾回收算法为 **引用计数法**(reference-counting), 和 Modula-3's Network Objects 很相似.(详情请搜索 "Network Objects")


To accomplish reference-counting garbage collection, the RMI runtime keeps track of all live references within each Java virtual machine. When a live reference enters a Java virtual machine, its reference count is incremented. The first reference to an object sends a "referenced" message to the server for the object. As live references are found to be unreferenced in the local virtual machine, the count is decremented. When the last reference has been discarded, an unreferenced message is sent to the server. Many subtleties exist in the protocol; most of these are related to maintaining the ordering of referenced and unreferenced messages in order to ensure that the object is not prematurely collected.

为实现引用计数, RMI 运行时需要跟踪各JVM中的存活对象引用. 当一个对象引用进入JVM时, 它的引用次数加 1; client第一次引用某个对象时, 会向服务器发送一条 "referenced" 消息. 在本地JVM中, 如果释放某个引用一次, 则引用次数减 1。当最后一个引用被丢弃时, 向服务器发送一条 "unreferenced" 消息. 协议中有很多坑; 但大多数消息都是在维护 referenced 和 unreferenced 消息, 目的是确保这些对象不会被过早回收(prematurely collected)。


When a remote object is not referenced by any client, the RMI runtime refers to it using a weak reference. The weak reference allows the Java virtual machine's garbage collector to discard the object if no other local references to the object exist. The distributed garbage collection algorithm interacts with the local Java virtual machine's garbage collector in the usual ways by holding normal or weak references to objects.

如果某个 remote object 不再被任何客户端引用, RMI运行时就会使用弱引用来指向它. 假如服务端也不存在其他强引用, 那么在垃圾收集时, 就有可能会将弱引用丢弃.  分布式垃圾收集算法, 与 client JVM 之间, 主要是通过常规引用(normal reference), 以及弱引用(weak reference)的方式来进行交互。


As long as a local reference to a remote object exists, it cannot be garbage-collected and it can be passed in remote calls or returned to clients. Passing a remote object adds the identifier for the virtual machine to which it was passed to the referenced set. A remote object needing unreferenced notification must implement the`java.rmi.server.Unreferenced` interface. When those references no longer exist, the `unreferenced` method will be invoked. `unreferenced` is called when the set of references is found to be empty so it might be called more than once. Remote objects are only collected when no more references, either local or remote, still exist.

只要客户端还有引用指向 remote object, 就不应该回收服务器中的这个对象, 有可能还会通过该对象进行远程调用(remote call), 或者作为返回值传递给客户端. 传递 remote object 时会添加虚拟机标识, 然后放到 referenced set 中。 远程对象必须实现 `java.rmi.server.Unreferenced` 接口, 以支持 unreferenced 通知。当没有引用时, 就会执行 `unreferenced`方法。`unreferenced` 方法可能会被执行很多次, 只要客户端发现 references set 是空的就会调用一次。远程对象, 只有当 server 端, 以及 client 端都不存在对其的引用时, 才会被回收。


Note that if a network partition exists between a client and a remote server object, it is possible that premature collection of the remote object will occur (since the transport might believe that the client crashed). Because of the possibility of premature collection, remote references cannot guarantee referential integrity; in other words, it is always possible that a remote reference may in fact not refer to an existing object. An attempt to use such a reference will generate a `RemoteException` which must be handled by the application.

注意, 如果客户端和remote server object 之间发生网络分裂(network partition), 可能会造成过早回收(因为网络不通, server 会认为客户端崩溃了). 因为有过早回收(premature collection)的可能, 所以 remote reference 不能保证引用的完整性; 换句话说, 可能某个 remote reference 指向的对象并不存在了。这时候再使用这种 reference 就会抛出 `RemoteException`, 这种情况必须由开发人员编写代码进行捕获和处理。








原文链接: [https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html](https://docs.oracle.com/javase/8/docs/platform/rmi/spec/rmi-arch4.html)





