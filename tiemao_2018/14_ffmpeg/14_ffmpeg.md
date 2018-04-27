# FFMpeg截取mp3

FFMpeg是目前最友好的开源媒体处理工具。

Java 可以通过命令行来调用。


##  1.下载与安装

官网地址: <https://www.ffmpeg.org/>

下载页面: <https://www.ffmpeg.org/download.html>

然后选择操作系统, 找到对应的安装包或者源码。

下拉页面, 找到 gzip 格式的源码安装包: <https://www.ffmpeg.org/releases/ffmpeg-4.0.tar.gz>


安装编译环境:

```
# 如果已经有这些环境，则不需要安装
sudo yum install -y automake autoconf libtool gcc gcc-c++
sudo yum install -y make
sudo yum install -y yasm
```

下载编译与安装

```
wget https://www.ffmpeg.org/releases/ffmpeg-4.0.tar.gz

tar zxf ffmpeg-4.0.tar.gz
cd ffmpeg-4.0

# 配置
sudo ./configure --prefix=/usr 

# 编译
sudo make

# 安装

sudo make install

```

测试安装成功:

```
cd ~

# 打印版本信息
ffmpeg -version

# 查看帮助信息
ffmpeg -h

# 操作手册; manual
man ffmpeg

```


##  2. 截取

ffmpeg 命令的用法为:

```
ffmpeg [options] [[infile options] -i infile]...
       {[outfile options] outfile}...
```

还可以查看帮助信息:

```
-t duration         录制或转码 audio/video 的持续时间, 单位秒
-ss time_off        设置跳过的时间
-sseof time_off     设置相对于结束时间的 offset
-acodec codec       指定转码器,(copy 则是拷贝)
-f fmt              强制指定编码格式
```

所以我们尝试使用:

```
ffmpeg -ss 39 -t 60  -i zhaohua.mp3  -acodec copy zhaohua30.mp3

```

其中, `-ss 30` 指定跳过起始时间30秒。 `-t 60` 则指定长度为60秒。

`-i zhaohua.mp3` 指定输入文件,  `-acodec copy` 指定输出的转码器为拷贝。 最后的 `zhaohua30.mp3` 则是输出文件。


## 3. Java操作


