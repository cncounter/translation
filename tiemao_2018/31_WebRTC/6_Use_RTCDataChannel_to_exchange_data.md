## 6. Use RTCDataChannel to exchange data

## 6. RTCDataChannel传输任意数据

## What you'll learn

## 本节知识点

- How to exchange data between WebRTC endpoints (peers).

- WebRTC端点之间如何交换数据(同行)。

A complete version of this step is in the **step-03** folder.

一个完整版的这一步是* * step-03 * *文件夹。

## Update your HTML

## 更新你的HTML

For this step, you'll use WebRTC data channels to send text between two `textarea` elements on the same page. That's not very useful, but does demonstrate how WebRTC can be used to share data as well as streaming video.

在这个步骤中,您将使用WebRTC数据通道发送文本之间的两个`textarea`在相同的页面上的元素。这不是很有用,但展示如何使用WebRTC共享数据以及视频。

Remove the video and button elements from **index.html** and replace them with the following HTML:

把视频和按钮元素从* *指数。html * *,代之以以下html:

```
<textarea id="dataChannelSend" disabled
    placeholder="Press Start, enter some text, then press Send."></textarea>
<textarea id="dataChannelReceive" disabled></textarea>

<div id="buttons">
  <button id="startButton">Start</button>
  <button id="sendButton">Send</button>
  <button id="closeButton">Stop</button>
</div>
```



One textarea will be for entering text, the other will display the text as streamed between peers.

textarea将输入文本,另一个将显示同行之间的文本流。

**index.html** should now look like this:

* *指数。html * *现在看起来应该像这样:

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
    placeholder="Press Start, enter some text, then press Send."></textarea>
  <textarea id="dataChannelReceive" disabled></textarea>

  <div id="buttons">
    <button id="startButton">Start</button>
    <button id="sendButton">Send</button>
    <button id="closeButton">Stop</button>
  </div>

  <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
  <script src="js/main.js"></script>

</body>

</html>
```



Update your JavaScript

更新您的JavaScript

Replace **main.js** with the contents of **step-03/js/main.js**.

溶入在望。* *js * * with the高兴of step-03 * * * * js / main.js /。

As with the previous step, it's not ideal doing cut-and-paste with large chunks of code in a codelab, but (as with RTCPeerConnection) there's no alternative.

和前面的步骤一样,它不是理想做codelab剪切和粘贴大量代码,但(如RTCPeerConnection)没有选择。

Try out streaming data between peers: open **index.html**, press **Start** to set up the peer connection, enter some text in the `textarea` on the left, then click **Send** to transfer the text using WebRTC data channels.

尝试同行之间的流数据:开放* *指数。html * *,按* * * *开始建立对等连接,输入一些文本`textarea`在左边,然后单击* * * *发送到文本使用的WebRTC数据传输通道。

## How it works

## 它是如何工作的

This code uses RTCPeerConnection and RTCDataChannel to enable exchange of text messages.

这段代码使用RTCPeerConnection和RTCDataChannel启用短信交流。

Much of the code in this step is the same as for the RTCPeerConnection example.

大部分的代码在这一步RTCPeerConnection例子是一样的。

The `sendData()` and `createConnection()` functions have most of the new code:

的`sendData()`和`createConnection()`函数的大部分新代码:

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

RTCDataChannel故意的语法类似于WebSocket,用`send()`方法和`message`事件。

Notice the use of `dataConstraint`. Data channels can be configured to enable different types of data sharing — for example, prioritizing reliable delivery over performance. You can find out more information about options at [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel).

请注意使用`dataConstraint`。数据通道可以使不同类型的配置数据共享——例如,优先在性能可靠传递.你可以找到更多的信息关于选项(Mozilla开发人员网络)(https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel)。

**Three types of constraints**

* * * *三种类型的约束

It's confusing!

这是困惑!

Different types of WebRTC call setup options are all often referred to as 'constraints'.

不同类型的WebRTC调用设置选项都是通常被称为“约束”。

Find out more about constraints and options:

找到更多关于约束和选择:

- [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection)
- [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel)
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

- (RTCPeerConnection)(https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection)
- (RTCDataChannel)(https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel)
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## Bonus points

## 加分

1. With [SCTP](https://bloggeek.me/sctp-data-channel/), the protocol used by WebRTC data channels, reliable and ordered data delivery is on by default. When might RTCDataChannel need to provide reliable delivery of data, and when might performance be more important — even if that means losing some data?
2. Use CSS to improve page layout, and add a placeholder attribute to the "dataChannelReceive" textarea.
3. Test the page on a mobile device.

1. 与(SCTP)(https://bloggeek.me/sctp-data-channel/),WebRTC协议使用的数据通道,可靠和命令数据交付是在默认情况下.当RTCDataChannel可能需要提供可靠的交付的数据,当可能性能更重要——即使这意味着失去了一些数据?
2. 使用CSS来改善页面布局,添加一个占位符属性“dataChannelReceive”文本区域。
3. 测试页面在一个移动设备。

## What you learned

## 你学到了什么

In this step you learned how to:

在这个步骤中,您了解了如何:

- Establish a connection between two WebRTC peers.
- Exchange text data between the peers.

- 两个WebRTC同行之间建立连接。
- 同行之间的交换文本数据。

A complete version of this step is in the **step-03** folder.

一个完整版的这一步是* * step-03 * *文件夹。

## Find out more

## 了解更多

- [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/) (a couple of years old, but still worth reading)
- [Why was SCTP Selected for WebRTC's Data Channel?](https://bloggeek.me/sctp-data-channel/)

- [WebRTC数据通道](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/)(几岁,但是仍然值得一读)
- (为什么选择SCTP WebRTC数据通道的?)(https://bloggeek.me/sctp-data-channel/)

## Next up

## 后续内容

You've learned how to exchange data between peers on the same page, but how do you do this between different machines? First, you need to set up a signaling channel to exchange metadata messages. Find out how in the next step!

您已经了解了如何同行之间交换数据在同一页面,但是如何在不同的机器之间的呢?首先,您需要设置一个信号通道交换元数据信息.找出在下一步!

