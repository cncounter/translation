



## 1. 安装SDKMAN管理器

安装SDKMAN的脚本为:

```sh
# 1.1 安装: 如果没有权限可以考虑sudo用户执行;
curl -s "https://get.sdkman.io" | bash


# 1.2 安装完成后查看版本号
sdk version


# 1.3 查看帮助信息
sdk help

```

SDKMAN的更多用法请参考官网页面: 

> https://sdkman.io/



## 2. 通过SDK管理器安装JDK



```sh
# 2.1 列出支持的Java SDK
sdk list java

# 2.2 安装GraalVM 17
sdk install java 17.0.9-graal

# 安装GraalVM 21
# sdk install java 21.0.2-graal

```










参考链接:

- [GraalVM vs OpenJDK GC Performance Comparison](https://blog.ycrash.io/2023/10/04/graalvm-vs-openjdk-gc-performance-comparison/)
- [GraalVM官网: https://graalvm.org](https://graalvm.org)
- [OpenJDK官网: https://openjdk.org](https://openjdk.org)
- [SDKMAN! 管理工具](https://sdkman.io)


