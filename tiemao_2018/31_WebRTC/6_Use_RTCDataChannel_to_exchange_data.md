## 6. Use RTCDataChannel to exchange data

## 6. 通过RTCDataChannel传输数据

## What you'll learn

## 本节内容

- How to exchange data between WebRTC endpoints (peers).

- 怎样在WebRTC端点(peers)间传输数据。

A complete version of this step is in the **step-03** folder.

本节的完整版代码位于 `step-03` 文件夹中。

## Update your HTML

## 更新HTML代码

For this step, you'll use WebRTC data channels to send text between two `textarea` elements on the same page. That's not very useful, but does demonstrate how WebRTC can be used to share data as well as streaming video.

在本节中, 将会使用WebRTC的数据通道(data channel), 在同一个页面上的两个 `textarea` 元素中传递文本。虽然这个示例本身没有什么生产使用价值, 但我们的目的是为了展示如何使用WebRTC来共享数据和视频。

Remove the video and button elements from **index.html** and replace them with the following HTML:

从上一节的代码中, 将 **index.html** 文件中的 `video` 和 `button` 元素移除, 并替换为以下代码:

```
<textarea id="dataChannelSend" disabled
    placeholder="先点击[开始]按钮, 然后输入任意文字, 再点击[发送]按钮."></textarea>
<textarea id="dataChannelReceive" disabled></textarea>

<div id="buttons">
  <button id="startButton">开始</button>
  <button id="sendButton">发送</button>
  <button id="closeButton">停止</button>
</div>
```



One textarea will be for entering text, the other will display the text as streamed between peers.

第一个 `textarea` 用来接收输入文本, 而另一个则用来展示端点之间传送过来的数据。

**index.html** should now look like this:

现在, **index.html** 的内容应该是这样的:

```
<!DOCTYPE html>
<html>

<head>

  <title>Realtime communication with WebRTC</title>

  <link rel="stylesheet" href="css/main.css" />

</head>

<body>

  <h1>Realtime communication with WebRTC</h1>

  <textarea id="dataChannelSend" disabled
      placeholder="先点击[开始]按钮, 然后输入任意文字, 再点击[发送]按钮."></textarea>
  <textarea id="dataChannelReceive" disabled></textarea>

  <div id="buttons">
    <button id="startButton">开始</button>
    <button id="sendButton">发送</button>
    <button id="closeButton">停止</button>
  </div>

  <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
  <script src="js/main.js"></script>

</body>

</html>
```



Update your JavaScript

更新 JavaScript 代码

Replace **main.js** with the contents of **step-03/js/main.js**.

将 `step-03/js/main.js` 的内容复制到 `main.js` 文件中。

As with the previous step, it's not ideal doing cut-and-paste with large chunks of code in a codelab, but (as with RTCPeerConnection) there's no alternative.

前面的小节也说过, 这种大量粘贴代码的方式并不是理想的做法, 特别是在示例教程之中, 但没有办法, 因为 RTCPeerConnection 要跑起来就需要依赖这么多东西。

Try out streaming data between peers: open **index.html**, press **Start** to set up the peer connection, enter some text in the `textarea` on the left, then click **Send** to transfer the text using WebRTC data channels.

在端点之间传输数据: 打开 **index.html**, 点击 **Start** 按钮, 以建立对等连接, 然后在左边的文本框之中输入一些字符, 点击 **Send** 按钮, 将文本通过 WebRTC 的数据通道传送出去。

## How it works

## 工作原理

This code uses RTCPeerConnection and RTCDataChannel to enable exchange of text messages.

这段代码使用 RTCPeerConnection 和 RTCDataChannel 来传输文本消息。

Much of the code in this step is the same as for the RTCPeerConnection example.

本节中的大部分代码, 和上一节中的 RTCPeerConnection 示例是相同的。

The `sendData()` and `createConnection()` functions have most of the new code:

新增的代码主要集中在 `sendData()` 和 `createConnection()` 函数中:

```
function createConnection() {
  dataChannelSend.placeholder = '';
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  trace('Using SCTP based data channels');
  // For SCTP, reliable and ordered delivery is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);
  trace('Created send data channel');

  localConnection.onicecandidate = iceCallback1;
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection =
      new RTCPeerConnection(servers, pcConstraint);
  trace('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = iceCallback2;
  remoteConnection.ondatachannel = receiveChannelCallback;

  localConnection.createOffer().then(
    gotDescription1,
    onCreateSessionDescriptionError
  );
  startButton.disabled = true;
  closeButton.disabled = false;
}

function sendData() {
  var data = dataChannelSend.value;
  sendChannel.send(data);
  trace('Sent Data: ' + data);
}
```



The syntax of RTCDataChannel is deliberately similar to WebSocket, with a `send()` method and a `message` event.

RTCDataChannel 的使用类似于 WebSocket, 提供了 `send()` 方法和 `message` 事件。

Notice the use of `dataConstraint`. Data channels can be configured to enable different types of data sharing — for example, prioritizing reliable delivery over performance. You can find out more information about options at [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel).

请注意 `dataConstraint` 的使用。数据通道可以配置为不同类型的数据共享 —— 如, 可靠性优先于性能等. 更多的信息请参考MDN上的文档: <https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel> 。

**Three types of constraints**

**三种约束类型**

It's confusing!

这是容易造成困扰的地方!

Different types of WebRTC call setup options are all often referred to as 'constraints'.

WebRTC中不同类型的配置选项都被称为是“约束”(constraints)。

Find out more about constraints and options:

更多关于约束和配置选项的信息, 请参考:

- [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection)
- [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel)
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)


## Bonus points

## 练习与实践

1. With [SCTP](https://bloggeek.me/sctp-data-channel/), the protocol used by WebRTC data channels, reliable and ordered data delivery is on by default. When might RTCDataChannel need to provide reliable delivery of data, and when might performance be more important — even if that means losing some data?
2. Use CSS to improve page layout, and add a placeholder attribute to the "dataChannelReceive" textarea.
3. Test the page on a mobile device.

1. WebRTC数据通道使用的协议: [SCTP](https://bloggeek.me/sctp-data-channel/), 默认情况下, 具备了可靠/顺序的消息传输功能. 如果 RTCDataChannel 更需要可靠性, 或者更需要传输性能的时候怎么处理呢? —— 有时候即使丢点数据也无所谓, 比如视频聊天。
2. 使用CSS来美化页面布局, 为 "dataChannelReceive" 对应的 textarea 添加 placeholder 属性。
3. 在移动设备上进行测试。

## What you learned

## 知识点回顾

In this step you learned how to:

在本节课程中, 我们学习了:

- Establish a connection between two WebRTC peers.
- Exchange text data between the peers.

- 在两个WebRTC端点之间建立连接。
- 在端点之间传输文本数据。

A complete version of this step is in the **step-03** folder.

本节的完整版代码位于 `step-03` 文件夹中。

## Find out more

## 了解更多

- [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/) (a couple of years old, but still worth reading)
- [Why was SCTP Selected for WebRTC's Data Channel?](https://bloggeek.me/sctp-data-channel/)


## Next up

## 后续内容

You've learned how to exchange data between peers on the same page, but how do you do this between different machines? First, you need to set up a signaling channel to exchange metadata messages. Find out how in the next step!

我们学习了在同一页面中的WebRTC端点之间如何进行数据传输, 但在不同的设备之间怎么进行数据传输呢? 前提是, 需要建立信令通道来交换元数据. 我们在下一节进行讲解!

