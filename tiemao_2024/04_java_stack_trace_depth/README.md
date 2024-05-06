# 4. 探析Java的调用栈深度

## 背景信息

发现一个有意思的现象, 有一段代码, 使用FastJSON序列化输出给前端时, 报了一个 `StackOverflowError` 错误;
查看异常栈, 发现深度为1024;

```java

org.springframework.web.util.NestedServletException: Handler dispatch failed; 
  nested exception is java.lang.StackOverflowError
    // ...

Caused by: java.lang.StackOverflowError: null
	at fj.SerializeConfig.getObjectWriter(SerializeConfig.java:444)
	at fj.SerializeConfig.getObjectWriter(SerializeConfig.java:440)
	at fj.JSONSerializer.getObjectWriter(JSONSerializer.java:448)
	at fj.ListSerializer.write(ListSerializer.java:76)
	at fj.FieldSerializer.writeValue(FieldSerializer.java:318)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:472)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:154)
	at fj.FieldSerializer.writeValue(FieldSerializer.java:318)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:472)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:154)
	at fj.ListSerializer.write(ListSerializer.java:79)
	at fj.FieldSerializer.writeValue(FieldSerializer.java:318)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:472)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:154)
	at fj.FieldSerializer.writeValue(FieldSerializer.java:318)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:472)
	at fj.JavaBeanSerializer.write(JavaBeanSerializer.java:154)
	at fj.ListSerializer.write(ListSerializer.java:79)
    // ... 这里总的有1024个 at
    // 为了排版省略; fj.=com.alibaba.fastjson.serializer.

```

为什么是1024呢? 是调用栈的深度超过1024就抛 `StackOverflowError` 错误吗?


## JVM与Stack相关的配置

我们可以使用 `-XX:+PrintFlagsFinal` 选项查看JVM配置, 并通过 grep 工具过滤含有 `Stack` 的输出结果。

示例如下:

```sh
% java -XX:+PrintFlagsFinal -version | grep Stack
  intx CompilerThreadStackSize    = 1024    {pd product} {default}
 uintx GCDrainStackTargetSize     = 64         {product} {ergonomic}
  bool JavaMonitorsInStackTrace   = true       {product} {default}
size_t MarkStackSize              = 4194304    {product} {ergonomic}
size_t MarkStackSizeMax           = 16777216   {product} {default}
  intx MaxJavaStackTraceDepth     = 1024       {product} {default}
  bool OmitStackTraceInFastThrow  = true       {product} {default}
  intx OnStackReplacePercentage   = 140     {pd product} {default}
  bool RestrictReservedStack      = true       {product} {default}
  intx StackRedPages              = 1       {pd product} {default}
  intx StackReservedPages         = 1       {pd product} {default}
  intx StackShadowPages           = 20      {pd product} {default}
  bool StackTraceInThrowable      = true       {product} {default}
  intx StackYellowPages           = 2       {pd product} {default}
  intx ThreadStackSize            = 1024    {pd product} {default}
  bool UseOnStackReplacement      = true    {pd product} {default}
  intx VMThreadStackSize          = 1024    {pd product} {default}

java version "11.0.6" 2020-01-14 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.6+8-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.6+8-LTS, mixed mode)
```

简单解读一下;

| -- | -- |
| 参数名称              | 示例| 说明信息 |
| ThreadStackSize      | `-XXThreadStackSize=1024`| 单位k字节; 类似于 `-xss1M` 或者 `-ss1M`;  |



如果增加命令行选项 `-Xss4m`:

```sh
java -Xss4m -XX:+PrintFlagsFinal -version | grep ThreadStackSize

```

则输出结果会有所变化:

```sh
# 默认值{default}
  intx ThreadStackSize       = 1024    {pd product} {default}

# 使用命令行选项{command line}:  -Xss4m
  intx ThreadStackSize       = 4096    {pd product} {command line}
```

可以看到 `ThreadStackSize` 标志的值变为了 `4096`。


## 参考链接


- [Exploring JVM Tuning Flags](https://www.baeldung.com/jvm-tuning-flags)
- [Configuring Stack Sizes in the JVM](https://www.baeldung.com/jvm-configure-stack-sizes)

