## 5. Stream video with RTCPeerConnection

## 5.通过RTCPeerConnection传输流媒体视频

## What you'll learn

## 本节内容

In this step you'll find out how to:

我们将在本节课程中, 学习以下内容:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.

- 使用WebRTC兼容库: [adapter.js](https://github.com/webrtc/adapter), 来抹平各浏览器间的差异。
- 通过 RTCPeerConnection API 传输流媒体视频。
- 控制 media 的捕捉与传输。

A complete version of this step is in the **step-2** folder.

本节的完整版代码位于 **step-2** 文件夹中。

## What is RTCPeerConnection?

## RTCPeerConnection 简介

RTCPeerConnection is an API for making WebRTC calls to stream video and audio, and exchange data.

RTCPeerConnection 是 WebRTC 中用来进行 视频流/音频流传输, 以及数据交换的API。

This example sets up a connection between two RTCPeerConnection objects (known as peers) on the same page.

本文的示例程序, 将会在一个页面上, 通过两个 RTCPeerConnection 对象(即peers)建立一条连接通道。

Not much practical use, but good for understanding how RTCPeerConnection works.

虽然没什么实际的作用, 但主要目的是为了理解 RTCPeerConnection 的工作原理。

## Add video elements and control buttons

## 添加 video 元素以及控制按钮

In **index.html** replace the single video element with two video elements and three buttons:

在 **index.html** 文件中, 配置两个 video 元素, 以及三个按钮:

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

其中的一个 video 元素(`id="localVideo"`)用于展示 `getUserMedia()` 获取到的流媒体信息, 另一个 video 元素(`id="remoteVideo"`)则通过RTCPeerconnection, 显示同样的内容。在实际的应用中, 页面中一般有两个 video 元素, 一个用来展示本地视频, 另一个则播放远程传输过来的视频( 请参考微信视频聊天, 其中有一大一小两个视频播放窗口 )。

## Add the adapter.js shim

## 添加 adapter.js 兼容库

Add a link to the current version of [**adapter.js**](https://github.com/webrtc/adapter)** **above the link to **main.js**:

在 **main.js** 引用的前面, 添加 [**adapter.js**](https://github.com/webrtc/adapter) 的最新版本:

```
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
```



**adapter.js** is a shim to insulate apps from spec changes and prefix differences. (Though in fact, the standards and protocols used for WebRTC implementations are highly stable, and there are only a few prefixed names.)

**adapter.js** 是一个适配程序、隔离了应用程序和规范变更、前缀变化等差异.(事实上, WebRTC实现所使用的标准和协议都是非常稳定的, 只有几个定义好的API。)

In this step, we've linked to the most recent version of **adapter.js**, which is fine for a codelab but not may not be right for a production app**. **The [adapter.js GitHub repo](https://github.com/webrtc/adapter) explains techniques for making sure your app always accesses the most recent version.

在这一步中, 我们链接到 **adapter.js** 的最新版本。对于实验和教程来说很强大了, 但如果用于生产环境可能还需要进一步完善。 `adapter.js`仓库的地址为:  <https://github.com/webrtc/adapter>, 其中的解析技术保证你使用到的是最新的版本。

For full information about WebRTC interop, see [webrtc.org/web-apis/interop](https://webrtc.org/web-apis/interop/).

WebRTC 相关的详细交互信息, 请参考: <https://webrtc.org/web-apis/interop/>。

**Index.html** should now look like this:

现在, **Index.html** 的内容如下:

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

## 调用 RTCPeerConnection

Replace **main.js** with the version in the **step-02** folder.

使用 **step-02** 文件夹中的 **main.js** 文件替换 work 目录下对应文件。

It's not ideal doing cut-and-paste with large chunks of code in a codelab, but in order to get RTCPeerConnection up and running, there's no alternative but to go the whole hog.

在 demo 教程的一个步骤中, 替换大量的代码可能学习起来有点麻烦, 但没有什么更好的办法, 因为 RTCPeerConnection 要跑起来是一个环环相扣的过程。


You'll learn how the code works in a moment.

下面我们将详细讲解代码的工作原理。

## Make the call

## 拨打视频通话

Open **index.html**, click the **Start** button to get video from your webcam, and click **Call** to make the peer connection. You should see the same video (from your webcam) in both video elements. View the browser console to see WebRTC logging.

打开 **index.html**, 单击 **Start** 按钮, 从摄像头获取视频, 然后点击 **Call** 来简历对等连接(peer connection)。 如果成功, 那么就可以在两个 video 中看到相同的视频内容. 查看浏览器的控制台, 看看 WebRTC 的日志记录。

## How it works

## 原理解析

This step does a lot...

这一步做了很多的操作...

**If you want to skip the explanation below, that's fine.**

**下面的内容比较复杂, 如果不关心具体过程, 可以直接跳到下一节。**

**You can still continue with the codelab!**

**跳过下面的步骤, 依然可以继续该教程的学习!**

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

