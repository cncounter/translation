# New features in Java 9


Java 9 is planned to be released in March 2017. It will be 3 years since Java 8 was released. Are you still excited about the new features introduced in Java 8 such as Lambda, new Date APIs etc? Now Java 9 is to be released and there are also quite a few fantastic new features to be introduced.

Below is a list of major new features in Java 9.




- Modular system. Java 9 will introduce a brand new modular system to organize Java codes. The modular system will divide different packages into different modules to ensure reliable configuration and strong encapsulation. With this, you only need to ship the necessary modules you application need in the JDK. It saves space and it is extremely helpful to run Java on mobile devices then. This is the biggest feature introduced in Java 9.

- JShell. A command line tool used to run Java code without wrapping them into classes. It is similar to command line tools in other scripting languages such as PHP, Python etc. You can execute Java declarations, expressions and statements in the command line tool. It will be helpful to the teachers and students who want to teach and learn Java.

- HTTP/2 support. HTTP/2 is a replacement for how HTTP is expressed “on the wire.” It is not a ground-up rewrite of the protocol; HTTP methods, status codes and semantics are the same, and it should be possible to use the same APIs as HTTP/1.x (possibly with some small additions) to represent the protocol. This specification was released in May 2015. With the added features, Java 9 will also add the support for HTTP/2. It will define a new HTTP client API that implements HTTP/2 and WebSocket, and can replace the legacy HttpURLConnection API.

- DTLS support. Java already has support for TLS which provides secure communication based on reliable transport layer such as TCP. But there is no support for secure communication over datagram transport layer such as UDP. TLS cannot be used over datagram transport layer because it cannot tolerate out of order packets and data loss. Java 9 will add the support for DTLS(Datagram Transport Layer Security) which can work over datagram transport layer. This will largely help applications which use UDP.

- Port to Linux/AArch64. AArch64 is the new processor architecture from ARM Holdings plc. It is a departure from the 32-bit ARM processor architecture, and is effectively a complete redesign. It needs a new OpenJDK port.

- Light weight JSON API. The light-weight JSON API would be delivered in Java 9 SDK through the java.util package. This provides a light-weight API for parsing, generation, and consumption of JSON data. Previously, third party libraries are created to parse JSON data such as Gson.

- Support private interface methods. With the introduction of Lambda in Java 8, default methods are introduced to interface to add new functionality to embrace Lambda. If two default methods need to share code, a private interface method would allow them to do so, but without exposing that private method and all its "implementation details" via the interface.

- Disallow _ as a one-character identifier. In the future, _ cannot be used as the identifier. In Java 8, if you use it as an identifier, you will get a warning. In Java 9, you will get an error when using _ as an identifier.

- Support for TIFF image format. With the popularity of TIFF format and also OS X uses TIFF as a standard platform image format, there are many requests that requesting Java to support TIFF. Suitable TIFF reader and writer plugins, written entirely in Java, were previously developed in the Java Advanced Imaging API Tools Project. This will be merged into Java 9 and become part of the J2SE.


Hope you can get your hands dirty on these new features when you finally get a full fledged Java 9. 





New-features-in-Java-9