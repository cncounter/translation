# Java 9 的新特性

New features in Java 9


Java 9 is planned to be released in March 2017. It will be 3 years since Java 8 was released. Are you still excited about the new features introduced in Java 8 such as Lambda, new Date APIs etc? Now Java 9 is to be released and there are also quite a few fantastic new features to be introduced.

Java 9 计划于 2017 年 3 月发布。届时距离 Java 8 发布将满 3 年。你是否还对 Java 8 引入的新特性(如 Lambda、新的 Date API 等)感到兴奋? 如今 Java 9 即将发布, 同样有不少令人惊艳的新特性将要引入。

Below is a list of major new features in Java 9.

下面是 Java 9 主要新特性的列表。




- Modular system. Java 9 will introduce a brand new modular system to organize Java codes. The modular system will divide different packages into different modules to ensure reliable configuration and strong encapsulation. With this, you only need to ship the necessary modules you application need in the JDK. It saves space and it is extremely helpful to run Java on mobile devices then. This is the biggest feature introduced in Java 9.

- 模块化系统。Java 9 将引入全新的模块化系统来组织 Java 代码。模块化系统会把不同的包划分到不同的模块中, 以确保可靠的配置和强封装。这样一来, 你只需在 JDK 中带上应用所需的模块即可。它节省了空间, 因此在移动设备上运行 Java 将极为有用。这是 Java 9 引入的最大特性。

- JShell. A command line tool used to run Java code without wrapping them into classes. It is similar to command line tools in other scripting languages such as PHP, Python etc. You can execute Java declarations, expressions and statements in the command line tool. It will be helpful to the teachers and students who want to teach and learn Java.

- JShell。一个命令行工具, 用于运行 Java 代码而无需把它们包装成类。它类似于 PHP、Python 等其他脚本语言中的命令行工具。你可以在该命令行工具中执行 Java 的声明、表达式和语句。对于想要教授和学习 Java 的老师和学生来说, 它将很有帮助。

- HTTP/2 support. HTTP/2 is a replacement for how HTTP is expressed “on the wire.” It is not a ground-up rewrite of the protocol; HTTP methods, status codes and semantics are the same, and it should be possible to use the same APIs as HTTP/1.x (possibly with some small additions) to represent the protocol. This specification was released in May 2015. With the added features, Java 9 will also add the support for HTTP/2. It will define a new HTTP client API that implements HTTP/2 and WebSocket, and can replace the legacy HttpURLConnection API.

- 支持 HTTP/2。HTTP/2 是对 HTTP 在“线路上”表示方式的一次替换。它并非对协议推倒重来的重写; HTTP 方法、状态码和语义都保持不变, 并且应当可以使用与 HTTP/1.x 相同的 API(可能需要少量新增)来表示该协议。该规范于 2015 年 5 月发布。借助这些新增特性, Java 9 也将加入对 HTTP/2 的支持。它会定义一套新的 HTTP 客户端 API, 实现 HTTP/2 和 WebSocket, 并可替代旧的 HttpURLConnection API。

- DTLS support. Java already has support for TLS which provides secure communication based on reliable transport layer such as TCP. But there is no support for secure communication over datagram transport layer such as UDP. TLS cannot be used over datagram transport layer because it cannot tolerate out of order packets and data loss. Java 9 will add the support for DTLS(Datagram Transport Layer Security) which can work over datagram transport layer. This will largely help applications which use UDP.

- 支持 DTLS。Java 已经支持 TLS, 它基于 TCP 等可靠传输层提供安全通信。但对于基于 UDP 等数据报传输层的安全通信, Java 尚无支持。TLS 无法用于数据报传输层, 因为它无法容忍乱序数据包和数据丢失。Java 9 将加入对 DTLS(Datagram Transport Layer Security, 数据报传输层安全)的支持, 它可以工作在数据报传输层之上。这将在很大程度上帮助使用 UDP 的应用。

- Port to Linux/AArch64. AArch64 is the new processor architecture from ARM Holdings plc. It is a departure from the 32-bit ARM processor architecture, and is effectively a complete redesign. It needs a new OpenJDK port.

- 移植到 Linux/AArch64。AArch64 是 ARM Holdings plc 推出的新处理器架构。它不同于 32 位 ARM 处理器架构, 实际上是一次彻底的重新设计。它需要一个新的 OpenJDK 移植版本。

- Light weight JSON API. The light-weight JSON API would be delivered in Java 9 SDK through the java.util package. This provides a light-weight API for parsing, generation, and consumption of JSON data. Previously, third party libraries are created to parse JSON data such as Gson.

- 轻量级 JSON API。轻量级的 JSON API 将通过 java.util 包在 Java 9 SDK 中提供。它提供了一套轻量级 API, 用于解析、生成和消费 JSON 数据。此前, 人们创建了 Gson 等第三方库来解析 JSON 数据。

- Support private interface methods. With the introduction of Lambda in Java 8, default methods are introduced to interface to add new functionality to embrace Lambda. If two default methods need to share code, a private interface method would allow them to do so, but without exposing that private method and all its "implementation details" via the interface.

- 支持私有接口方法。随着 Java 8 引入 Lambda, 接口中引入了默认方法, 以便为拥抱 Lambda 添加新功能。如果两个默认方法需要共享代码, 私有接口方法就能让它们做到这一点, 同时不会通过接口暴露该私有方法及其所有"实现细节"。

- Disallow _ as a one-character identifier. In the future, _ cannot be used as the identifier. In Java 8, if you use it as an identifier, you will get a warning. In Java 9, you will get an error when using _ as an identifier.

- 禁止将 _ 用作单字符标识符。将来不能再用 _ 作为标识符。在 Java 8 中, 如果把它用作标识符, 你会收到一条警告。在 Java 9 中, 把 _ 用作标识符则会报错。

- Support for TIFF image format. With the popularity of TIFF format and also OS X uses TIFF as a standard platform image format, there are many requests that requesting Java to support TIFF. Suitable TIFF reader and writer plugins, written entirely in Java, were previously developed in the Java Advanced Imaging API Tools Project. This will be merged into Java 9 and become part of the J2SE.

- 支持 TIFF 图像格式。随着 TIFF 格式的流行, 以及 OS X 将 TIFF 作为标准的平台图像格式, 出现了许多请求 Java 支持 TIFF 的呼声。此前适合的 TIFF 读写插件完全用 Java 编写, 并在 Java Advanced Imaging API Tools Project 中开发。它将被合并进 Java 9, 成为 J2SE 的一部分。


Hope you can get your hands dirty on these new features when you finally get a full fledged Java 9. 

希望你最终用上功能完备的 Java 9 时, 能亲自尝试这些新特性。




New-features-in-Java-9
