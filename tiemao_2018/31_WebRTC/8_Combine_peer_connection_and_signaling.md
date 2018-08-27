## 8. Combine peer connection and signaling

## 8. 集成信令服务

## What you'll learn

## 本节内容

In this step you'll find out how to:

在本节课程中, 将学习以下内容:

- Run a WebRTC signaling service using Socket.IO running on Node.js
- Use that service to exchange WebRTC metadata between peers.

- 使用Node.js平台, 通过Socket.IO启动信令服务。
- 使用信令服务来交换WebRTC客户端之间的元数据。

A complete version of this step is in the **step-05** folder.

本节的完整版代码位于 `step-05` 文件夹中。

## Replace HTML and JavaScript

## 替换HTML和JavaScript代码

Replace the contents of **index.html** with the following:

更新 **index.html** 文件, 内容如下:

```
<!DOCTYPE html>
<html>

<head>
  <title>Realtime communication with WebRTC</title>
  <link rel="stylesheet" href="/css/main.css" />
</head>

<body>
  <h1>Realtime communication with WebRTC</h1>
  <div id="videos">
    <video id="localVideo" autoplay muted></video>
    <video id="remoteVideo" autoplay></video>
  </div>
  <script src="/socket.io/socket.io.js"></script>
  <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```


Replace **js/main.js** with the contents of **step-05/js/main.js**.

使用 **step-05/js/main.js** 文件替换 **js/main.js** 文件:

## Run the Node.js server

## 启动Node.js服务器

If you are not following this codelab from your **work** directory, you may need to install the dependencies for the **step-05**folder or your current working folder. Run the following command from your working directory:

如果没有照着本教程的步骤执行, 则需要安装**step-05**目录下的依赖项, 或者在当前工作目录下安装也行。 安装依赖的命令如下:

```
npm install
```



Once installed, if your Node.js server is not running, start it by calling the following command in the **work** directory:

安装完成后, 如果还没启动 Node.js 服务器, 可以在**work**目录下执行命令:

```
node index.js
```



Make sure you're using the version of **index.js** from the previous step that implements Socket.IO. For more information on Node and Socket IO, review the section "Set up a signaling service to exchange messages".

请确认**index.js**文件的内容中包含了 Socket.IO 相关的内容, 参考前一小节。更多关于 Node 和Socket.IO的内容, 请参考 [7_Set_up_signaling_service.md](./7_Set_up_signaling_service.md)。

From your browser, open **localhost:8080**.

打开浏览器, 输入地址: <http://localhost:8080>。

Open **localhost:8080** again, in a new tab or window. One video element will display the local stream from `getUserMedia()`and the other will show the 'remote' video streamed via RTCPeerconnection.

再打开第二个标签页或者新窗口, 输入地址: <http://localhost:8080>。 一个video元素 将展示`getUserMedia()`获取到的本地视频流, 另一个则展示通过 RTCPeerconnection 读取到的远程视频流。

You'll need to restart your Node.js server each time you close a client tab or window.

因为程序功能比较简单, 如果重新打开了客户端标签页, 则需要重启 Node.js服务器。

View logging in the browser console.

相关的日志信息, 请在浏览器的控制台中查看。

## **Bonus points**

## 练习与实践

1. This application supports only one-to-one video chat. How might you change the design to enable more than one person to share the same video chat room?
2. The example has the room name *foo* hard coded. What would be the best way to enable other room names?
3. How would users share the room name? Try to build an alternative to sharing room names.
4. How could you change the app

1. 这个应用只支持一对一的视频聊天。修改设计方案, 让多人使用同一个聊天室。
2. 示例程序中的房间号硬编码为 *cnc*。有什么好方法可以使用其他房间号呢?
3. 用户怎样分享他的房间号? 请尝试一种分享房间号的办法。
4. 尝试改进这个应用

## What you learned

## 内容回顾

In this step you learned how to:

在本节课程中, 我们学到了:

- Run a WebRTC signaling service using Socket.IO running on Node.js.
- Use that service to exchange WebRTC metadata between peers.


- 使用Node.js平台, 通过Socket.IO启动信令服务。
- 使用信令服务来交换WebRTC客户端之间的元数据。

A complete version of this step is in the **step-05** folder.

本节的完整版代码位于 `step-05` 文件夹中。


## Tips

## 提示

- WebRTC stats and debug data are available from **chrome://webrtc-internals**.
- [test.webrtc.org](https://test.webrtc.org/) can be used to check your local environment and test your camera and microphone.
- If you have odd troubles with caching, try the following:
- Do a hard refresh by holding down ctrl and clicking the **Reload** button
- Restart the browser
- Run `npm cache clean` from the command line.

- WebRTC的统计数据和调试信息请访问: <chrome://webrtc-internals>。
- 可以访问 <https://test.webrtc.org/> 来检查本地环境, 以及测试摄像头和麦克风。
- 如果碰到奇怪的缓存问题, 可以尝试以下方案:
- 强制刷新, 比如按住 ctrl键并单击刷新按钮。
- 重启浏览器
- 执行命令: `npm cache clean`。

## Next up

## 后续内容

Find out how to take a photo, get the image data, and share that between remote peers.

接下来, 我们将学习如何拍照并分享给另一个客户端。

