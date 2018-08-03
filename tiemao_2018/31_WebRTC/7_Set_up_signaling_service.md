## 7. Set up a signaling service to exchange messages

## 7. 配置信令服务器

## What you'll learn

## 你将学习

In this step, you'll find out how to:

在这个步骤中,您将了解如何:

- Use `npm` to install project dependencies as specified in **package.json**
- Run a Node.js server and use node-static to serve static files.
- Set up a messaging service on Node.js using Socket.IO.
- Use that to create 'rooms' and exchange messages.

- 使用`npm`安装项目依赖项中指定* * package.json * *
- 一个节点运行。js服务器并使用node-static为静态文件。
- 建立一个消息传递服务节点。js使用socket . io。
- 用它来创建“房间”和交换消息。

A complete version of this step is in the **step-04** folder.

一个完整版的这一步是* * step-04 * *文件夹。

## Concepts

## 概念

In order to set up and maintain a WebRTC call, WebRTC clients (peers) need to exchange metadata:

为了建立和维护一个WebRTC调用,WebRTC客户(同行)需要交换元数据:

- Candidate (network) information.
- **Offer** and **answer** messages providing information about media, such as resolution and codecs.

- 候选人信息(网络)。
- * * * *和* * * *回答信息提供的信息媒体,比如分辨率和编解码器。

In other words, an exchange of metadata is required before peer-to-peer streaming of audio, video, or data can take place. This process is called **signaling**.

换句话说,交换元数据需要在p2p流媒体音频、视频或数据。这个过程称为* *信号* *。

In the previous steps, the sender and receiver RTCPeerConnection objects are on the same page, so 'signaling' is simply a matter of passing metadata between objects.

在前面的步骤中,发送方和接收方RTCPeerConnection对象在同一页,所以“信号”只是一个元数据对象之间传递的问题。

In a real world application, the sender and receiver RTCPeerConnections run in web pages on different devices, and you need a way for them to communicate metadata.

在真实的应用程序中,发送方和接收方RTCPeerConnections在网页在不同的设备上运行,您需要一种方法,他们交流的元数据。

For this, you use a **signaling server**: a server that can pass messages between WebRTC clients (peers). The actual messages are plain text: stringified JavaScript objects.

为此,您使用一个服务器* *:* *信号的服务器之间可以通过消息WebRTC客户(同行)。实际的纯文本消息:stringified JavaScript对象。

## Prerequisite: Install Node.js

## 先决条件:安装node . js

In order to run the next steps of this codelab (folders **step-04** to **step-06**) you will need to run a server on localhost using Node.js.

为了运行的下一步codelab(文件夹* * step-04 * * * * step-06 * *)你需要在本地主机上运行一个服务器使用node . js。

You can download and install Node.js from [this link](https://nodejs.org/en/download/) or via your preferred [package manager](https://nodejs.org/en/download/package-manager/).

你可以下载并安装节点。js(这个链接)(https://nodejs.org/en/download/)或通过你喜欢的包管理器(https://nodejs.org/en/download/package-manager/)。

Once installed, you will be able to import the dependencies required for the next steps (running `npm install`), as well as running a small localhost server to execute the codelab (running `node index.js`). These commands will be indicated later, when they are required.

安装完成后,您将能够导入下一个步骤(运行所需的依赖关系`npm install`),以及运行一个小localhost服务器执行codelab(运行`node index.js`)。这些命令将显示后,当他们需要。

## About the app

## 关于应用程序

WebRTC uses a client-side JavaScript API, but for real-world usage also requires a signaling (messaging) server, as well as STUN and TURN servers. You can find out more [here](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/).

WebRTC使用客户端JavaScript API,但是对于实际应用还需要一个信号(消息)服务器,以及眩晕和服务器。你可以找到更多[这](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)。

In this step you'll build a simple Node.js signaling server, using the Socket.IO Node.js module and JavaScript library for messaging. Experience with Node.js and Socket.IO will be useful, but not crucial; the messaging components are very simple.

在此步骤中,您将构建一个简单的节点。js信令服务器,使用套接字。输入输出节点。js对通讯模块和JavaScript库。节点的经验。js和套接字.IO会有用,但不重要;消息传递组件是非常简单的。

**Choosing the right signaling server**

服务器* * * *选择正确的信号

This codelab uses [Socket.IO](http://socket.io/) for a signaling server.

这个codelab使用(socket . io)信令服务器(http://socket.io/)。

The design of Socket.IO makes it straightforward to build a service to exchange messages, and Socket.IO is suited to learning about WebRTC signaling because of its built-in concept of 'rooms'.

插座的设计。IO使它简单的建立一个服务来交换消息,和套接字。IO是适合学习WebRTC信号由于其内置的“房间”的概念。

**However, for a production service, there are better alternatives. **See [How to Select a Signaling Protocol for Your Next WebRTC Project](https://bloggeek.me/siganling-protocol-webrtc/).

然而,* *为生产服务,有更好的选择。[* *看到如何为您的下一个WebRTC项目选择一个信号协议)(https://bloggeek.me/siganling-protocol-webrtc/)。

In this example, the server (the Node.js application) is implemented in **index.js**, and the client that runs on it (the web app) is implemented in **index.html**.

在这个示例中,服务器(节点。js应用程序)中实现* *指数。js * *,客户端上运行它(web应用程序)是实现* * * * index . html。

The Node.js application in this step has two tasks.

的节点。js应用程序在这一步有两个任务。

First, it acts as a message relay:



```
socket.on('message', function (message) {
  log('Got message: ', message);
  socket.broadcast.emit('message', message);
});
```



Second, it manages WebRTC video chat 'rooms':

第二,它管理WebRTC视频聊天“房间”:

```
if (numClients === 0) {
  socket.join(room);
  socket.emit('created', room, socket.id);
} else if (numClients === 1) {
  socket.join(room);
  socket.emit('joined', room, socket.id);
  io.sockets.in(room).emit('ready');
} else { // max two clients
  socket.emit('full', room);
}
```



Our simple WebRTC application will permit a maximum of two peers to share a room.

我们简单的WebRTC应用程序将允许最多两个同行分享一个房间。

## HTML & JavaScript

## HTML和JavaScript

Update **index.html** so it looks like this:

* *更新索引。html * *所以看起来像这样:

```
<!DOCTYPE html>
<html>

<head>

  <title>Realtime communication with WebRTC</title>

  <link rel="stylesheet" href="css/main.css" />

</head>

<body>

  <h1>Realtime communication with WebRTC</h1>

  <script src="/socket.io/socket.io.js"></script>
  <script src="js/main.js"></script>
  
</body>

</html>

```



You won't see anything on the page in this step: all logging is done to the browser console. (To view the console in Chrome, press Ctrl-Shift-J, or Command-Option-J if you're on a Mac.)

在页面上,你不会看到任何在这个步骤:完成所有的日志浏览器控制台。(查看控制台在Chrome,新闻Ctrl-Shift-J或Command-Option-J如果你在Mac)。

Replace **js/main.js** with the following:

取代* * js /主要。js和下面的* *:

```
'use strict';

var isInitiator;

window.room = prompt("Enter room name:");

var socket = io.connect();

if (room !== "") {
  console.log('Message from client: Asking to join room ' + room);
  socket.emit('create or join', room);
}

socket.on('created', function(room, clientId) {
  isInitiator = true;
});

socket.on('full', function(room) {
  console.log('Message from client: Room ' + room + ' is full :^(');
});

socket.on('ipaddr', function(ipaddr) {
  console.log('Message from client: Server IP address is ' + ipaddr);
});

socket.on('joined', function(room, clientId) {
  isInitiator = false;
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});
```



## Set up Socket.IO to run on Node.js

## 设置套接字。IO上运行node . js

In the HTML file, you may have seen that you are using a Socket.IO file:

在HTML文件中,你可能已经看到您正在使用一个套接字。输入输出文件:

```
<script src="/socket.io/socket.io.js"></script>
```



At the top level of your **work** directory create a file named **package.json** with the following contents:

在顶层的* * * *工作目录创建一个名为* *的文件包。json使用以下内容:* *

```
{
  "name": "webrtc-codelab",
  "version": "0.0.1",
  "description": "WebRTC codelab",
  "dependencies": {
    "node-static": "^0.7.10",
    "socket.io": "^1.2.0"
  }
}
```



This is an app manifest that tells Node Package Manager (`npm`) what project dependencies to install.

这是一个应用程序清单,告诉节点包管理器(`npm`项目依赖项安装。

To install dependencies (such as `/socket.io/socket.io.js`), run the following from the command line terminal, in your **work** directory:

(如安装依赖关系`/socket.io/socket.io.js`),运行下面的命令行终端,在* * * *工作目录:

```
npm install
```



You should see an installation log that ends something like this:

您应该看到一个安装日志结果是这样的:

![img](https://codelabs.developers.google.com/codelabs/webrtc-web/img/eba5a6336d420b40.png)



As you can see, `npm` has installed the dependencies defined in **package.json**.

正如您可以看到的,`npm`安装了* * package.json * *中定义的依赖关系。

Create a new file **index.js** at the top level of your **work** directory (not in the **js** directory) and add the following code:

创建一个新文件* *指数。js * *在* * * *工作的顶级目录(不是在* * js * *目录),并添加以下代码:

```
'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);

var io = socketIO.listen(app);
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

});
```



From the command line terminal, run the following command in the **work** directory:

从命令行终端,运行以下命令在* * * *工作目录:

```
node index.js
```



From your browser, open **localhost:8080**.

从您的浏览器,打开* * localhost:8080 * *。

Each time you open this URL, you will be prompted to enter a room name. To join the same room, choose the same room name each time, such as 'foo'.

每次你打开这个网址,你将被提示输入一个房间名称。加入同一个房间,每次选择同一个房间名称,如“foo”。

Open a new tab page, and open **localhost:8080** again. Choose the same room name.

打开一个新标签页,localhost:8080和开放的* * * *了。选择同一个房间的名字。

Open **localhost:8080** in a third tab or window. Choose the same room name again.

localhost:8080打开* * * *在第三个标签或窗口。再次选择同一个房间名称。

Check the console in each of the tabs: you should see the logging from the JavaScript above.

检查控制台在每个选项卡中,您应该看到日志从上面的JavaScript。

## Bonus points

## 加分

1. What alternative messaging mechanisms might be possible? What problems might you encounter using 'pure' WebSocket?
2. What issues might be involved with scaling this application? Can you develop a method for testing thousands or millions of simultaneous room requests?
3. This app uses a JavaScript prompt to get a room name. Work out a way to get the room name from the URL. For example *localhost:8080/foo* would give the room name `foo`.

1. 选择消息传递机制可能什么?可能你遇到什么问题用“纯”WebSocket吗?
2. 哪些问题可能涉及扩展这个应用程序吗?你能开发一种方法测试数以千计甚至数以百万计的同时房间请求吗?
3. 这个应用程序使用一个JavaScript提示房间名称。出一个方法来得到房间的名字从URL。例如* localhost:8080 / foo *会给房间名称`foo`。

## What you learned

## 你学到了什么

In this step, you learned how to:

在这个步骤中,您学习了如何:

- Use npm to install project dependencies as specified in package.json
- Run a Node.js server to server static files.
- Set up a messaging service on Node.js using socket.io.
- Use that to create 'rooms' and exchange messages.

- 使用新的project to install作为帮助package.json in清单
- 一个节点运行。js服务器服务器静态文件。
- 建立一个消息传递服务节点。js使用socket . io。
- 用它来创建“房间”和交换消息。

A complete version of this step is in the **step-04** folder.

一个完整版的这一步是* * step-04 * *文件夹。

## Find out more

## 了解更多

- [Socket.io chat-example repo](https://github.com/rauchg/chat-example)
- [WebRTC in the real world: STUN, TURN and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)
- [The term 'signaling' in WebRTC](https://www.webrtc-experiment.com/docs/WebRTC-Signaling-Concepts.html)

- [公钥。这次chat-example热](https://github.com/rauchg/chat-example)
- [WebRTC在现实世界:眩晕,转身信号)(http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)
- (术语“信号”的WebRTC)(https://www.webrtc-experiment.com/docs/WebRTC-Signaling-Concepts.html)

## Next up

## 接下来

Find out how to use signaling to enable two users to make a peer connection.

找出如何使用信号,使两个用户做出对等连接。

