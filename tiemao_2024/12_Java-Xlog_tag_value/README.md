# JVM启动参数 `-Xlog` 简介

Enable Logging with the JVM Unified Logging Framework


## 1. 背景

监控排查到某个项目的业务执行耗时大幅度上涨。

顺便注意到class unloading的次数也在上升。

该项目使用的是 JDK21版本, 

尝试增加JVM启动参数 `-XX:+TraceClassLoading -XX:+TraceClassUnloading` 时报错了:


```lang=sh

java -XX:+TraceClassLoading -XX:+TraceClassUnloading -version

Unrecognized VM option 'TraceClassLoading'
Error: Could not create the Java Virtual Machine.
Error: A fatal exception has occurred. Program will exit.
```

原来是JDK17升级时把这些选项废弃了, 改成使用 **JVM统一日志框架(JVM Unified Logging Framework)** 来进行内部信息的输出。

相关信息请参考: [JDK 17移除或废弃的工具和组件](https://docs.oracle.com/en/java/javase/17/migrate/removed-tools-and-components.html)


## 2. 简单示例


设置环境变量, 最终影响JVM命令行启动选项:


```lang=sh
# JDK21-使用ZGC分代选项并输出 class+unload 日志
JAVA_OPTS=-Xmx12g -Xms12g -XX:+UseZGC -XX:+ZGenerational -Xlog:class+unload=info
```


示例日志:

```lang=sh


[2024-11-05 16:26:45.819] [1058.734s][info][class,unload] unloading class java.lang.invoke.LambdaForm$MH/0x00007f1168f5c000 0x00007f1168f5c000
[2024-11-05 16:26:45.819] [1058.734s][info][class,unload] unloading class java.lang.invoke.LambdaForm$MH/0x00007f1168f5b400 0x00007f1168f5b400
[2024-11-05 16:26:45.819] [1058.734s][info][class,unload] unloading class java.lang.invoke.LambdaForm$MH/0x00007f1168f5b000 0x00007f1168f5b000
[2024-11-05 16:26:45.819] [1058.734s][info][class,unload] unloading class java.lang.invoke.LambdaForm$MH/0x00007f1168f5ac00 0x00007f1168f5ac00

[2024-11-05 17:01:22.440] [3135.355s][info][class,unload] unloading class Script_1730797188569_242 0x00007f1168eac800
[2024-11-05 17:01:22.440] [3135.355s][info][class,unload] unloading class Script_1730797188569_241 0x00007f1168eaf000
[2024-11-05 17:01:22.440] [3135.355s][info][class,unload] unloading class Script_1730797188568_240 0x00007f1168eb0000
```

## 3. 原因排查

Aviator 没有开启缓存参数，导致每次都使用全新的。


## 4. Xlog选项简介

通过以下命令, 可以查看帮助信息:

```lang=sh
# 查看Java支持的-X选项
java -X

# 查看 -Xlog 的使用说明
java -Xlog:help

-Xlog Usage: -Xlog[:[selections][:[output][:[decorators][:output-options]]]]
	 其中 'selections' 部分, 是 tags 和 levels 的组合; 格式为: tag1[+tag2...][*][=level][,...]
	 NOTE: Unless wildcard (*) is specified, only log messages tagged with exactly the tags specified will be matched.

```




详细的介绍请参考: [Enable Logging with the JVM Unified Logging Framework](https://docs.oracle.com/en/java/javase/11/tools/java.html#GUID-BE93ABDC-999C-4CB5-A88B-1994AAAC74D5)




## 3. Xlog选项支持的标签和级别








## 6. 参考文档


- [Xlog参数选项使用教程](https://www.oracle.com/webfolder/technetwork/tutorials/obe/java/tutorial-Xlog/html/index.html)
- [JDK11 - java 命令行选项列表](https://docs.oracle.com/en/java/javase/11/tools/java.html)
- [JEP 158: Unified JVM Logging](https://openjdk.org/jeps/158)
- [JEP 158: Unified JVM Logging](https://bugs.openjdk.org/browse/JDK-8046148)