# Spring AI 入门


## 1. 环境准备


首先可以安装 Spring Cli。

安装包下载页面:

> https://github.com/spring-projects/spring-cli/releases

其中, 带 `standalone` 或者 `installer` 的版本, 内置集成了对应的JDK; 



如果是MAC系统, 可能会有安全限制, 通过 `xattr` 命令可以去除  `@` 属性:

```sh
# 查看帮助
xattr -h

# 清除 clear 所有 xattr 属性
xattr -c spring-cli-standalone-0.9.0-osx.aarch64.zip
```

然后再解压即可。


如果是安装有 Home Brew 的 MacOS 或者 Linux 系统, 也可以使用以下命令:

```sh
# MAC
brew tap spring-cli-projects/spring-cli
brew install spring-cli

```

如果是下载安装包, 可能需要配置PATH环境变量, 比如:

```sh

# spring-cli 环境变量
SPRING_CLI_HOME=/Users/renfufei/SOFT_ALL/spring-cli-standalone-0.9.0-osx-aarch64
export PATH=$PATH:$SPRING_CLI_HOME/bin

```

spring-cli/bin 目录下, 有这些命令:

- java 
- javac		
- keytool		
- serialver	
- spring		
- spring.bat

> 注意: 不要和JDK的冲突了, 所以可以将 spring-cli 的优先级降低, 也就是想办法让 PATH 中的 `$SPRING_CLI_HOME/bin` 处于后面的位置。


检查是否成功安装和配置:

```sh

# 查看版本信息
% spring version
Build Version: 0.9.0
Git Short Commit Id: 7ad6b57


```


## 2. 简单使用

参考官方教程: <https://spring.io/projects/spring-ai>

```sh

# 1. 查看帮助信息
spring help

# 2. 进入代码目录
cd ~/GITHUB_ALL

# 3. 创建AI应用
spring boot new --from ai --name myai

# 4. 等待项目创建完成 ... 进入目录;
cd myai

# 5. 启动项目;
./mvw spring-boot:run

```





