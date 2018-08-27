## 8. Combine peer connection and signaling

## 8. 集成信令服务

## What you'll learn

## 本节内容

In this step you'll find out how to:

在本节课程中, 将学习以下内容:

- Run a WebRTC signaling service using Socket.IO running on Node.js
- Use that service to exchange WebRTC metadata between peers.

- 运行一个WebRTC使用套接字信号服务。IO上运行node . js
- 使用该服务来交换WebRTC同行之间的元数据。

A complete version of this step is in the **step-05** folder.

一个完整版的这一步是* * step-05 * *文件夹。

## Replace HTML and JavaScript

## 替换HTML和JavaScript代码

Replace the contents of **index.html** with the following:

替换的内容* *指数。html与下面的* *:

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

溶入js /手。* *js * * with the高兴of step-05 * * * * js / main.js /。

## Run the Node.js server

## 运行的节点。js服务器

If you are not following this codelab from your **work** directory, you may need to install the dependencies for the **step-05**folder or your current working folder. Run the following command from your working directory:

若不codelab this下列工作的你* * * *指南》,特别是需要to the you dependencies for the * * * * step-05 folder但是你current folder工作组.Run from your下列命令:working目录

```
npm install
```



Once installed, if your Node.js server is not running, start it by calling the following command in the **work** directory:

安装完成后,如果你的节点。js服务器没有运行,启动它通过调用下面的命令在* * * *工作目录:

```
node index.js
```



Make sure you're using the version of **index.js** from the previous step that implements Socket.IO. For more information on Node and Socket IO, review the section "Set up a signaling service to exchange messages".

确保你使用的版本* *指数。js实现socket . io * *从上一步.在节点和套接字IO的更多信息,审核部分“建立一个信号服务交换消息”。

From your browser, open **localhost:8080**.

从您的浏览器,打开* * localhost:8080 * *。

Open **localhost:8080** again, in a new tab or window. One video element will display the local stream from `getUserMedia()`and the other will show the 'remote' video streamed via RTCPeerconnection.

开放localhost * * * * 8080:a new in again tab黄金机会。One审讯室湾流到地方构成will共同一致的`getUserMedia()`and the other will’remote’其他streamed审讯室RTCPeerconnection途经。

You'll need to restart your Node.js server each time you close a client tab or window.

你需要重新启动节点。js服务器每次关闭客户标签或窗口。

View logging in the browser console.

在浏览器中查看日志控制台。

### **Bonus points**

### 练习与实践

1. This application supports only one-to-one video chat. How might you change the design to enable more than one person to share the same video chat room?
2. The example has the room name *foo* hard coded. What would be the best way to enable other room names?
3. How would users share the room name? Try to build an alternative to sharing room names.
4. How could you change the app

1. 这个应用程序只支持一对一的视频聊天。如何改变你的设计让多个人共享相同的视频聊天室?
2. 这个例子有房间名称* foo *硬编码。什么是最好的办法让其他房间的名字吗?
3. 用户如何分享房间的名字吗?试图建立一个替代分享房间的名字。
4. 你怎么能改变这个程序吗

## What you learned

## 知识点回顾

In this step you learned how to:

在本节课程中, 我们学到了:

- Run a WebRTC signaling service using Socket.IO running on Node.js.
- Use that service to exchange WebRTC metadata between peers.

- 运行一个WebRTC使用套接字信号服务。IO上运行node . js。
- 使用该服务来交换WebRTC同行之间的元数据。

A complete version of this step is in the **step-05** folder.

一个完整版的这一步是* * step-05 * *文件夹。

## Tips

## 提示

- WebRTC stats and debug data are available from **chrome://webrtc-internals**.
- [test.webrtc.org](https://test.webrtc.org/) can be used to check your local environment and test your camera and microphone.
- If you have odd troubles with caching, try the following:
- Do a hard refresh by holding down ctrl and clicking the **Reload** button
- Restart the browser
- Run `npm cache clean` from the command line.

- WebRTC统计数据和调试数据可从* * chrome:/ / webrtc-internals * *。
- [test.webrtc.org](https://test.webrtc.org/)可以用来检查你的当地环境和测试你的摄像头和麦克风。
- 如果你有奇怪的问题与缓存,试试以下:
- 做一个硬按住ctrl并单击刷新的* *重载* *按钮
- 重启浏览器
- 运行`npm cache clean`从命令行。

## Next up

## 后续内容

Find out how to take a photo, get the image data, and share that between remote peers.

找出如何拍照,获得图像数据,以及远程同行之间分享。

