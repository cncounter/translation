
==



#### 下载地址

- 官网下载页面: [http://www.3proxy.ru/download/](http://www.3proxy.ru/download/)

- GitHub-release页面: [https://github.com/z3APA3A/3proxy/releases](https://github.com/z3APA3A/3proxy/releases)


类似 `3proxy-0.7.1.3-x64.zip` 这样的是 windows x64 的程序包 绿色版.

类似 `3proxy-0.7.1.3-lite.zip` 的是使用gcc编译，兼容 win95,98,2k.

类似 `3proxy-0.7.1.3.zip` 的是 win32 的程序包, 要求 win xp,2003+

类似 `tar.gz` 这样的是 github 自动打包的源码, linux 下需要编译。



## Windws 版本安装

假设解压后的目录为 : 	`C:\Program Files\3proxy-0.7.1.3-x64`

则下面有3个目录:

	bin64		## 可执行文件
	cfg			## 配置文件
	doc			## 文档,英文,俄文


打开 CMD, 执行

	cd C:\Program Files\3proxy-0.7.1.3-x64\bin64

进入目录以后,执行 `3proxy.exe`:


> C:\Program Files\3proxy-0.7.1.3-x64\bin64>3proxy.exe

	Usage: 3proxy.exe [conffile]
	
	        3proxy.exe --install [conffile]
	        to install as service
	
	        3proxy.exe --remove
	        to remove service

翻译过来就是: 

	用法: 3proxy.exe [配置文件]
	
	        3proxy.exe --install [配置文件]
	        安装 Windows 服务
	
	        3proxy.exe --remove
	        卸载服务


安装服务:

	3proxy.exe  --install  ..\cfg\3proxy.cfg



## 说明 ##

	C:\Program Files\3proxy-0.7.1.3-x64\bin64>3proxy.exe ../cfg/3proxy.cfg
	fopen(): Invalid argument
	Command: 'log' failed with code 1, line 41

	C:\Program Files\3proxy-0.7.1.3-x64\bin64>3proxy.exe ../cfg/3proxy.cfg
	fopen(): No such file or directory
	Command: 'log' failed with code 1, line 41



参考:

- [http://www.360doc.com/content/12/0322/14/834950_196617470.shtml](http://www.360doc.com/content/12/0322/14/834950_196617470.shtml)








### 作者信息 ##


- 作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
- : [欢迎加入【CNC开源组件开发交流 316630025】](http://shang.qq.com/wpa/qunwpa?idkey=68f416f83b8a247d3178f9934492dd5df28e9f386e1ca480e82b5ef4ca4e6539)
- 日期: 2015年12月23日

