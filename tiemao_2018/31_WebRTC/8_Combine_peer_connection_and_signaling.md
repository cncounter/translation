## 8. Combine peer connection and signaling

## WebRTC基础实践 - 8. 集成对等通信和信令服务

## What you'll learn

## 本节内容

In this step you'll find out how to:

在本节课程中, 我们将学习以下内容:

- Run a WebRTC signaling service using Socket.IO running on Node.js
- Use that service to exchange WebRTC metadata between peers.

- 在Node.js平台, 通过Socket.IO来启动信令服务。
- 用信令服务交换WebRTC客户端之间的元数据(metadata)。

A complete version of this step is in the **step-05** folder.

本节的完整版代码位于 `step-05` 文件夹中。

## Replace HTML and JavaScript

## 更新HTML和JavaScript代码

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

用 **step-05/js/main.js** 文件复制为 **js/main.js**。

## Run the Node.js server

## 启动Node.js

If you are not following this codelab from your **work** directory, you may need to install the dependencies for the **step-05**folder or your current working folder. Run the following command from your working directory:

如果没有执行上一节的操作, 需要在 **step-05**目录下, 或者工作目录下, 安装相应的依赖, 命令如下:

```
npm install
```


Once installed, if your Node.js server is not running, start it by calling the following command in the **work** directory:

安装完成后, 需要启动 Node.js 服务器, 在**work**目录下执行命令:

```
node index.js
```



Make sure you're using the version of **index.js** from the previous step that implements Socket.IO. For more information on Node and Socket IO, review the section "Set up a signaling service to exchange messages".

请确保 **index.js** 中的内容包含了前一节介绍的 Socket.IO 部分。更多Node.js和Socket.IO的内容, 请参考 [7_Set_up_signaling_service.md](./7_Set_up_signaling_service.md)。

From your browser, open **localhost:8080**.

服务器启动完成后, 请打开浏览器, 输入地址, 如: <http://localhost:8080>。

Open **localhost:8080** again, in a new tab or window. One video element will display the local stream from `getUserMedia()`and the other will show the 'remote' video streamed via RTCPeerconnection.

然后继续打开第二个标签页/新窗口, 输入地址: <http://localhost:8080>。 则页面中会显示两个video元素, 第一个展示 `getUserMedia()` 获取到的本地视频,第二个则展示 RTCPeerconnection 传输过来的远程视频。

You'll need to restart your Node.js server each time you close a client tab or window.

因为程序逻辑简单, 如果刷新或者关闭了客户端标签页, 则需要重启 Node.js 才能继续使用。

View logging in the browser console.

相关的日志信息, 可以在浏览器控制台中查看。

## **Bonus points**

## 练习与实践

1. This application supports only one-to-one video chat. How might you change the design to enable more than one person to share the same video chat room?
2. The example has the room name *foo* hard coded. What would be the best way to enable other room names?
3. How would users share the room name? Try to build an alternative to sharing room names.
4. How could you change the app

1. 本应用只支持一对一视频。请修改设计方案, 以支持多人使用同一聊天室。
2. 示例中的房间号硬编码为 *cnc*。有什么方法可以使用其他房间号呢?
3. 用户怎样才能分享他的房间号? 请尝试一种分享房间号的办法。
4. 尝试改进这个应用。

## What you learned

## 内容回顾

In this step you learned how to:

在本节课程中, 我们学习了:

- Run a WebRTC signaling service using Socket.IO running on Node.js.
- Use that service to exchange WebRTC metadata between peers.

- 在Node.js平台, 通过Socket.IO来启动信令服务。
- 用信令服务交换WebRTC客户端之间的元数据(metadata)。

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

- WebRTC相关的统计和调试信息, 请访问: <chrome://webrtc-internals>。
- 可以访问 <https://test.webrtc.org/> 来检查本地环境, 比如摄像头和麦克风等等。
- 如果碰到奇怪的缓存问题, 可以尝试以下步骤:
- 强制刷新浏览器, 比如 `CTRL+F5`, 或者按住ctrl键, 并单击刷新按钮。
- 重启计算机或者浏览器
- 执行清理npm缓存的命令: `npm cache clean`

## Next up

## 后续内容

Find out how to take a photo, get the image data, and share that between remote peers.

下一节, 我们将学习如何拍照, 并发送给另一个客户端。


原文链接: <https://codelabs.developers.google.com/codelabs/webrtc-web/#7>

翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

翻译日期: 2018年08月27日

