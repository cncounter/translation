# JVM监控与内存调优



参见: <https://github.com/cncounter/translation/tree/master/tiemao_2019/22_chat_jvm_troubleshoot>



参考: [JVM_MONITOR] 部分


JVM配置参数 

-???

-X???

-X???:???

-XX:+-???

-XX:???=???


JVM行为设置, JVM内存配置。

命令行监控、GUI图形界面监控。

本地监控。

远程监控。

离线监控。/日志/history。

错误恢复/诊断。

GC。



# JVisualVM


# gcviewer


命令行工具

jps


远程监控

# JSTATD

# 注册中心

# JMX

# Tunnel演示

离线监控。/日志/history。


> https://juejin.im/post/5b7044fe6fb9a009c249047e

```

sudo jps -v

sudo jinfo 22429

sudo jstat -class 22429
Loaded  Bytes  Unloaded  Bytes     Time   
 20734 40883.6      482   773.0      52.27

sudo jstat -compiler 22429
Compiled Failed Invalid   Time   FailedType FailedMethod
   37952      2       0   318.76          1 org/springframework/cglib/core/MethodWrapper$MethodWrapperKey$$KeyFactoryByCGLIB$$552be97a hashCode

sudo jstat -gc 22429
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
4608.0 5120.0 2291.2  0.0   688640.0 538981.8 1398272.0  1286189.4  147968.0 136852.8 15360.0 13472.1  25771  194.165   5      0.879  195.045


jmap

jhat

jstack






```

错误恢复/诊断。

GC。


JDWP调试

JMAP

# JHAT

# MAT

