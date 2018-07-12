## 5. Stream video with RTCPeerConnection

## 5. 通过 RTCPeerConnection 传输视频流

## What you'll learn

## 你将学习

In this step you'll find out how to:

在此步骤中,我们将了解如何:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.

- 抽象WebRTC垫片,浏览器差异(adapter.js)(https://github.com/webrtc/adapter)。
- 使用RTCPeerConnection API流视频。
- 控制媒体捕捉和流。

A complete version of this step is in the **step-2** folder.

一个完整版的这一步是* *步骤2 * *文件夹。

## What is RTCPeerConnection?

## RTCPeerConnection是什么?

RTCPeerConnection is an API for making WebRTC calls to stream video and audio, and exchange data.

RTCPeerConnection是一个API让WebRTC调用流视频和音频,和交换数据。

This example sets up a connection between two RTCPeerConnection objects (known as peers) on the same page.

这个例子中设置两个RTCPeerConnection对象之间的连接(称为同行)在相同的页面上。

Not much practical use, but good for understanding how RTCPeerConnection works.

没有什么实际用途,但有利于理解RTCPeerConnection是如何工作的。

## Add video elements and control buttons

## 添加视频元素和控制按钮

In **index.html** replace the single video element with two video elements and three buttons:

在* *指数。html * *取代单一视频元素有两个视频元素和三个按钮:

```
<video id="localVideo" autoplay playsinline></video>
<video id="remoteVideo" autoplay playsinline></video>


<div>
  <button id="startButton">Start</button>
  <button id="callButton">Call</button>
  <button id="hangupButton">Hang Up</button>
</div>
```



One video element will display the stream from `getUserMedia()`and the other will show the same video streamed via RTCPeerconnection. (In a real world application, one video element would display the local stream and the other the remote stream.)

将显示一个视频元素流`getUserMedia()`和其他将显示相同的视频通过RTCPeerconnection流。(在现实世界的应用程序中,一个视频元素将显示本地流和其他远程流)。

## Add the adapter.js shim

## 添加适配器。js垫片

Add a link to the current version of [**adapter.js**](https://github.com/webrtc/adapter)** **above the link to **main.js**:

添加一个链接到当前版本的(* * adapter.js * *)(https://github.com/webrtc/adapter)* * * *以上链接到* * main.js * *:

```
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
```



**adapter.js** is a shim to insulate apps from spec changes and prefix differences. (Though in fact, the standards and protocols used for WebRTC implementations are highly stable, and there are only a few prefixed names.)

* *适配器。js * *是一个垫片隔离应用程序从规范和前缀的差异变化.(尽管事实上,WebRTC实现使用的标准和协议是高度稳定的,只有几个前缀的名字。)

In this step, we've linked to the most recent version of **adapter.js**, which is fine for a codelab but not may not be right for a production app**. **The [adapter.js GitHub repo](https://github.com/webrtc/adapter) explains techniques for making sure your app always accesses the most recent version.

在这一步中,我们与* *适配器的最新版本。js * *,好codelab但不可能不适合生产应用* *。* *(适配器。js GitHub回购)(https://github.com/webrtc/adapter)解释了技术来确保应用程序总是访问最新版本。

For full information about WebRTC interop, see [webrtc.org/web-apis/interop](https://webrtc.org/web-apis/interop/).

WebRTC reparacion供For[webrtc.org/web-apis/interop](此前,见https://webrtc.org/web-apis/interop/)。

**Index.html** should now look like this:

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

  <video id="localVideo" autoplay playsinline></video>
  <video id="remoteVideo" autoplay playsinline></video>

  <div>
    <button id="startButton">Start</button>
    <button id="callButton">Call</button>
    <button id="hangupButton">Hang Up</button>
  </div>

  <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```



## Install the RTCPeerConnection code

## 安装RTCPeerConnection代码

Replace **main.js **with the version in the **step-02** folder.

取代主要* *。js版本的* * * * step-02 * *文件夹。

It's not ideal doing cut-and-paste with large chunks of code in a codelab, but in order to get RTCPeerConnection up and running, there's no alternative but to go the whole hog.

这不是理想做codelab剪切和粘贴大量代码,但为了得到RTCPeerConnection启动并运行,有别无选择的干到底。

You'll learn how the code works in a moment.

您将了解代码是如何工作的。

## Make the call

## 打这个电话

Open **index.html**, click the **Start** button to get video from your webcam, and click **Call** to make the peer connection. You should see the same video (from your webcam) in both video elements. View the browser console to see WebRTC logging.

开* *指数。html * *,单击开始* * * *按钮得到从你的摄像头的视频,然后点击电话* * * *的对等连接。您应该看到相同的视频(从你的摄像头)在视频元素.查看浏览器控制台看到WebRTC日志记录。

## How it works

## 它是如何工作的

This step does a lot...

这一步做了很多……

**If you want to skip the explanation below, that's fine.**

* *如果你想跳过下面的解释,这很好。* *

**You can still continue with the codelab!**

* *你仍然可以继续codelab ! * *

WebRTC uses the RTCPeerConnection API to set up a connection to stream video between WebRTC clients, known as **peers**.

WebRTC使用RTCPeerConnection API建立一个连接到流视频WebRTC客户之间,被称为* * * *。

In this example, the two RTCPeerConnection objects are on the same page: `pc1` and `pc2`. Not much practical use, but good for demonstrating how the APIs work.

在这个例子中,两个RTCPeerConnection对象在同一页:`pc1`和`pc2`。没有什么实际用途,但有利于展示这些api是如何工作的。

Setting up a call between WebRTC peers involves three tasks:

设置一个叫WebRTC同行之间涉及三个任务:

- Create a RTCPeerConnection for each end of the call and, at each end, add the local stream from `getUserMedia()`.
- Get and share network information: potential connection endpoints are known as [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) candidates.
- Get and share local and remote descriptions: metadata about local media in [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) format.

- 为每个结束调用创建一个RTCPeerConnection,两端,加上当地的流`getUserMedia()`。
- 获取和共享网络信息:潜在连接端点被称为(冰)(http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment)候选人。
- 获取和分享本地和远程描述:关于当地媒体在元数据(SDP)(http://en.wikipedia.org/wiki/Session_Description_Protocol)格式。

Imagine that Alice and Bob want to use RTCPeerConnection to set up a video chat.

假设Alice和Bob想用RTCPeerConnection建立一个视频聊天。

First up, Alice and Bob exchange network information. The expression 'finding candidates' refers to the process of finding network interfaces and ports using the [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) framework.

首先,Alice和Bob交换网络信息。表达“寻找候选人”是指的过程中发现网络接口和端口使用(冰)(http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment)框架。

1. Alice creates an RTCPeerConnection object with an `onicecandidate (addEventListener('icecandidate'))` handler. This corresponds to the following code from **main.js**:

1. 爱丽丝将创建一个RTCPeerConnection对象的`onicecandidate (addEventListener('icecandidate'))`处理程序。这对应于从* * main.js * *下面的代码:

```
let localPeerConnection;
```



```
localPeerConnection = new RTCPeerConnection(servers);
localPeerConnection.addEventListener('icecandidate', handleConnection);
localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
```



The `servers` argument to RTCPeerConnection isn't used in this example.

的`servers`参数RTCPeerConnection不是本例中使用。

This is where you could specify STUN and TURN servers.

在这里您可以指定击晕,把服务器。

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails.

WebRTC设计点对点工作,所以用户可以连接的最直接的路线.然而,WebRTC构建应对现实世界网络:客户机应用程序需要穿越NAT网关(http://en.wikipedia.org/wiki/NAT_traversal)和防火墙,和点对点网络需要回退,以防直接连接失败。

As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.

作为这个过程的一部分,WebRTC api使用眩晕服务器计算机的IP地址,并将服务器作为中继服务器的对等通信失败.(WebRTC在现实世界中)(http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)更详细地解释道。

1. Alice calls `getUserMedia()` and adds the stream passed to that:

1. 爱丽丝的电话`getUserMedia()`并添加流传递给:

```
navigator.mediaDevices.getUserMedia(mediaStreamConstraints).
  then(gotLocalMediaStream).
  catch(handleLocalMediaStreamError);
```



```
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace('Received local stream.');
  callButton.disabled = false;  // Enable call button.
}
```



```
localPeerConnection.addStream(localStream);
trace('Added local stream to localPeerConnection.');
```



1. The `onicecandidate` handler from step 1. is called when network candidates become available.
2. Alice sends serialized candidate data to Bob. In a real application, this process (known as **signaling**) takes place via a messaging service – you'll learn how to do that in a later step. Of course, in this step, the two RTCPeerConnection objects are on the same page and can communicate directly with no need for external messaging.
3. When Bob gets a candidate message from Alice, he calls `addIceCandidate()`, to add the candidate to the remote peer description:

1. 的`onicecandidate`处理程序从步骤1。时调用网络候选人变得可用。
2. 爱丽丝将序列化候选人数据发送给鲍勃。在真实的应用程序中,这个过程(称为* *信号* *)发生通过消息传递服务,您将学习如何在以后的步骤.当然,在这一步中,两个RTCPeerConnection对象在同一页面,可以直接沟通,不需要外部消息传递。
3. 当鲍勃从爱丽丝获得候选人的信息,他的电话`addIceCandidate()`候选人添加到远程对等描述:

```
function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error);
      });

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`);
  }
}
```



WebRTC peers also need to find out and exchange local and remote audio and video media information, such as resolution and codec capabilities. Signaling to exchange media configuration information proceeds by exchanging blobs of metadata, known as an **offer** and an **answer**, using the Session Description Protocol format, known as [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol):

WebRTC同行还需要发现和交换本地和远程音频和视频媒体信息,分辨率和编解码器等功能.信号交换媒体通过交换blob的元数据配置信息收益,称为一个* * * *和* *回答* *,使用会话描述协议的格式,被称为(SDP)(http://en.wikipedia.org/wiki/Session_Description_Protocol):

1. Alice runs the RTCPeerConnection `createOffer()` method. The promise returned provides an RTCSessionDescription: Alice's local session description:

1. 爱丽丝运行RTCPeerConnection`createOffer()`方法。提供了一个返回的承诺RTCSessionDescription:爱丽丝的本地会话描述:

```
trace('localPeerConnection createOffer start.');
localPeerConnection.createOffer(offerOptions)
  .then(createdOffer).catch(setSessionDescriptionError);
```



1. If successful, Alice sets the local description using `setLocalDescription()` and then sends this session description to Bob via their signaling channel.
2. Bob sets the description Alice sent him as the remote description using `setRemoteDescription()`.
3. Bob runs the RTCPeerConnection `createAnswer()` method, passing it the remote description he got from Alice, so a local session can be generated that is compatible with hers. The `createAnswer()` promise passes on an RTCSessionDescription: Bob sets that as the local description and sends it to Alice.
4. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription()`. 

1. 如果成功,爱丽丝集使用当地的描述`setLocalDescription()`然后发送这个会话描述鲍勃通过信号通道。
2. 鲍勃集描述爱丽丝送给他作为远程描述使用`setRemoteDescription()`。
3. 鲍勃运行RTCPeerConnection`createAnswer()`方法,通过远程描述他从爱丽丝,所以可以生成本地会话是兼容的。的`createAnswer()`承诺通过一个RTCSessionDescription:鲍勃,随着当地描述并将其发送给爱丽丝。
4. 当爱丽丝鲍勃的会话描述,她集远程描述`setRemoteDescription()`。

```
// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description) {
  trace(`Offer from localPeerConnection:\n${description.sdp}`);

  trace('localPeerConnection setLocalDescription start.');
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection setRemoteDescription start.');
  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('remotePeerConnection createAnswer start.');
  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

  trace('remotePeerConnection setLocalDescription start.');
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

  trace('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);
}
```



1. Ping!

1. 平!

## Bonus points

## 加分

1. Take a look at **chrome://webrtc-internals**. This provides WebRTC stats and debugging data. (A full list of Chrome URLs is at **chrome://about**.)
2. Style the page with CSS:

1. 看看* * chrome:/ / webrtc-internals * *。这提供了WebRTC统计数据和调试数据。(一个完整的列表的Chrome url在* * Chrome:/ / * *。)
2. 用CSS样式页面:

- Put the videos side by side.
- Make the buttons the same width, with bigger text.
- Make sure the layout works on mobile.

- 把视频并排。
- 使按钮相同的宽度,和更大的文本。
- 确保布局在移动工作。

1. From the Chrome Dev Tools console, look at `localStream`, `localPeerConnection` and `remotePeerConnection`.
2. From the console, look at `localPeerConnectionpc1.localDescription`. What does SDP format look like?

1. 从Chrome开发工具控制台,看看`localStream`,`localPeerConnection`和`remotePeerConnection`。
2. 从控制台,看看`localPeerConnectionpc1.localDescription`。SDP的格式是什么样子?

## What you learned

## 你学到了什么

In this step you learned how to:

在这个步骤中,您了解了如何:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.
- Share media and network information between peers to enable a WebRTC call.

- 抽象WebRTC垫片,浏览器差异(adapter.js)(https://github.com/webrtc/adapter)。
- 使用RTCPeerConnection API流视频。
- 控制媒体捕捉和流。
- 在同行之间共享媒体和网络信息,使WebRTC调用。

A complete version of this step is in the **step-2** folder.



## Tips

## 提示

- There's a lot to learn in this step! To find other resources that explain RTCPeerConnection in more detail, take a look at [webrtc.org/start](https://webrtc.org/start). This page includes suggestions for JavaScript frameworks — if you'd like to use WebRTC, but don't want to wrangle the APIs.
- Find out more about the adapter.js shim from the [adapter.js GitHub repo](https://github.com/webrtc/adapter).
- Want to see what the world's best video chat app looks like? Take a look at AppRTC, the WebRTC project's canonical app for WebRTC calls: [app](https://appr.tc/), [code](https://github.com/webrtc/apprtc). Call setup time is less than 500 ms.

- 有很多学在这一步!寻找其他资源,详细说明RTCPeerConnection看看[webrtc.org/start)(https://webrtc.org/start).这个页面包含JavaScript框架的建议,如果你想使用WebRTC,但不想争论api。
- 找到更多关于适配器。js的垫片(适配器。js GitHub回购)(https://github.com/webrtc/adapter)。
- 希望看到世界上最好的视频聊天应用程序是什么样子的?看看AppRTC,WebRTC项目的规范化应用WebRTC电话:(app)(https://appr.tc/),(代码)(https://github.com/webrtc/apprtc)。呼叫建立时间小于500 ms。

## Best practice

## 最佳实践

- To future-proof your code, use the new Promise-based APIs and enable compatibility with browsers that don't support them by using [adapter.js](https://github.com/webrtc/adapter).

- 不会过时的代码,使用新的基于承诺的api和实现兼容的浏览器不支持他们通过使用(adapter.js)(https://github.com/webrtc/adapter)。

## Next up

## 接下来

This step shows how to use WebRTC to stream video between peers — but this codelab is also about data!

这个步骤显示了如何使用WebRTC同行之间的流视频——但这codelab也是关于数据!

In the next step find out how to stream arbitrary data using RTCDataChannel.

在下一步中找出如何使用RTCDataChannel流任意数据。

