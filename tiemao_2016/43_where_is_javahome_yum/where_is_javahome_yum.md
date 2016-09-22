# 如何查找YUM 安装的 JAVA_HOME

很多需要javac 的程序依赖 JAVA_HOME环境变量.

如果是手工下载源码安装的JDK，很容易知道JAVA_HOME的目录. 例如

	whereis javac

> javac: /usr/local/jdk1.8.0_74/bin/javac

那么对应的 JAVA_HOME 为 `/usr/local/jdk1.8.0_74`.

而 YUM 安装的 jdk, 不需要配置 PATH, 因为已经自动使用软连接做好了。

	echo $PATH
	javac -version

## 1. YUM安装JDK

### 1.1 查找 可用的JDK

	sudo yum list -y java*

然后可用看到类似下面这样的输出(省略部分...):

	...
	Available Packages
	
	java-1.7.0-openjdk.x86_64
	java-1.7.0-openjdk-demo.x86_64
	java-1.7.0-openjdk-devel.x86_64
	java-1.7.0-openjdk-javadoc.noarch
	java-1.7.0-openjdk-src.x86_64
	java-1.8.0-openjdk.x86_64
	java-1.8.0-openjdk-debug.x86_64
	java-1.8.0-openjdk-demo.x86_64
	java-1.8.0-openjdk-demo-debug.x86_64
	java-1.8.0-openjdk-devel.x86_64
	java-1.8.0-openjdk-devel-debug.x86_64
	java-1.8.0-openjdk-headless.x86_64
	java-1.8.0-openjdk-headless-debug.x86_64
	java-1.8.0-openjdk-javadoc.noarch
	java-1.8.0-openjdk-javadoc-debug.noarch
	java-1.8.0-openjdk-src.x86_64
	java-1.8.0-openjdk-src-debug.x86_64

根据需要, 安装 JDK1.7 或者 JDK1.8, 当前1.8已经很稳定了,推荐JDK1.8


### 1.2 安装 JDK

安装 JDK1.7 的命令如下:

	sudo yum install -y java-1.7.0-openjdk*


安装 JDK1.8 的命令如下:

	sudo yum install -y java-1.8.0-openjdk*


## 2. 查找 JDK1.7 的 JAVA_HOME

### 2.1  查找 javac ：

	whereis javac

> javac: /usr/bin/javac /usr/share/man/man1/javac.1.gz

可以看到, `/usr/bin/javac`, 一般来说 **/usr/bin** 默认加入了 PATH 路径,所以可以直接执行.

然后一路跟踪,看软连接指向的位置( `ll` 是 `ls -l` 的快捷命令):

	ll /usr/bin/javac

> ... /usr/bin/javac -> /etc/alternatives/javac

然后继续:

	ll  /etc/alternatives/javac

JDK1.7 大致是这个样子:

> ... /etc/alternatives/javac -> /usr/lib/jvm/java-1.7.0-openjdk.x86_64/bin/javac

再继续:

	ll /usr/lib/jvm/java-1.7.0-openjdk.x86_64/bin/javac

不再是软连接。 结合这个地址可以分析得到, `JAVA_HOME` 的值应该是 `/usr/lib/jvm/java-1.7.0-openjdk.x86_64`。

当然,使用这个地址就可以了!

如果继续下一步查看,可以看到具体的版本号:

	ll /usr/lib/jvm/java-1.7.0-openjdk.x86_64

> ... /usr/lib/jvm/java-1.7.0-openjdk.x86_64 -> java-1.7.0-openjdk-1.7.0.79.x86_64

使用下面的命令即可看到真实的目录, 但一般不使用下面的具体版本号,升级什么的可能会出问题。

	ll /usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79.x86_64

具体内容类似下面这样:

> ll /usr/lib/jvm/java-1.7.0-openjdk-1.7.0.79.x86_64


	total 43952
	-r--r--r--  1 root root     1503 Apr 15  2015 ASSEMBLY_EXCEPTION
	drwxr-xr-x  2 root root     4096 Dec 25  2015 bin
	drwxr-xr-x 10 root root     4096 May  2  2015 demo
	drwxr-xr-x  3 root root     4096 May  2  2015 include
	drwxr-xr-x  4 root root     4096 May  2  2015 jre
	drwxr-xr-x  3 root root     4096 May  3  2015 lib
	-r--r--r--  1 root root    19263 Apr 15  2015 LICENSE
	drwxr-xr-x  8 root root     4096 May  2  2015 sample
	-rw-r--r--  1 root root 44775741 Apr 15  2015 src.zip
	drwxr-xr-x  2 root root     4096 May  2  2015 tapset
	-r--r--r--  1 root root   172264 Apr 15  2015 THIRD_PARTY_README


### 2.2 将 JAVA_HOME 加入环境变量:

	export JAVA_HOME=/usr/lib/jvm/java-1.7.0-openjdk.x86_64

当然, export 只是临时的。下次重启后就没了。

可以添加到rc文件,比如 `/etc/rc.d/rc.local` 之中。

当然,可以使用 vim 编辑, 或者是 `echo >> ` 命令

	jhometip='# add JAVA_HOME'
	jhomescript='export JAVA_HOME=/usr/lib/jvm/java-1.7.0-openjdk.x86_64'
	sudo echo $jhometip >> /etc/rc.d/rc.local
	sudo echo $jhomescript >> /etc/rc.d/rc.local

这样一般就设置好了。


## 3. 查找 JDK1.8 的 JAVA_HOME

### 3.1  查找 javac ：

	whereis javac

> javac: /usr/bin/javac /usr/share/man/man1/javac.1.gz

可以看到, `/usr/bin/javac`, 一般来说 /usr/bin 默认加入了 PATH 路径,所以可以直接执行.

然后一路跟踪,看软连接指向的位置( `ll` 是 `ls -l` 的快捷命令):

	ll /usr/bin/javac

> ... /usr/bin/javac -> /etc/alternatives/javac

然后继续:

	ll  /etc/alternatives/javac

JDK1.8 大致是这个样子:

> ... /etc/alternatives/javac -> 
>
> /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64/bin/javac

再继续:

	ll /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64/bin/javac

不再是软连接。 结合这个地址可以分析得到, `JAVA_HOME` 的值应该是 `/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64`。

使用这个地址就可以了!

如果继续下一步查看:

	ll /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64

具体内容类似下面这样:

	total 16
	drwxr-xr-x. 2 root root 4096 Sep 21 23:08 bin
	drwxr-xr-x. 3 root root 4096 Sep 21 23:08 include
	drwxr-xr-x. 4 root root   26 Sep 21 23:08 jre
	drwxr-xr-x. 3 root root 4096 Sep 21 23:08 lib
	drwxr-xr-x. 2 root root 4096 Sep 21 23:08 tapset


### 3.2  将 JAVA_HOME 加入环境变量:

	export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64


当然, export 只是临时的。下次重启后就没了。

可以添加到rc文件,比如 `/etc/rc.d/rc.local` 之中。

当然,可以使用 vim 编辑, 或者是 `echo >> ` 命令

	jhometip='# add JAVA_HOME'
	jhomescript='export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.102-1.b14.el7_2.x86_64'
	sudo echo $jhometip >> /etc/rc.d/rc.local
	sudo echo $jhomescript >> /etc/rc.d/rc.local

这样一般就设置好了。


作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

日期: 2016年9月22日
