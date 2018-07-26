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

其中的一个 video 元素(`id="localVideo"`)用于展示 `getUserMedia()` 获取到的流媒体信息, 另一个 video 元素(`id="remoteVideo"`)则通过RTCPeerconnection, 显示同样的内容。在实际的应用中, 页面中一般有两个 video 元素: 第一个用来展示本地视频, 第二个则用来播放远程传输过来的视频( 请参考微信视频聊天, 其中有一大一小两个视频播放窗口 )。

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

> **If you want to skip the explanation below, that's fine.**

> **下面的内容比较复杂, 如果不关心具体过程, 可以直接跳到下一节。**

> **You can still continue with the codelab!**

> **跳过下面的步骤, 依然可以继续该教程的学习!**

WebRTC uses the RTCPeerConnection API to set up a connection to stream video between WebRTC clients, known as **peers**.

WebRTC 通过 RTCPeerConnection API, 在 WebRTC 客户端之间创建连接, 以传输流视频, 客户端被称为 **peer**。

In this example, the two RTCPeerConnection objects are on the same page: `pc1` and `pc2`. Not much practical use, but good for demonstrating how the APIs work.

在此示例程序中, 两个 RTCPeerConnection 对象在同一个页面中: `pc1` 和 `pc2`。 所以并没有什么实际使用价值, 只是用来展示怎样使用这些 api。

Setting up a call between WebRTC peers involves three tasks:

在 WebRTC 客户端之间创建视频通话, 需要执行三个任务:

- Create a RTCPeerConnection for each end of the call and, at each end, add the local stream from `getUserMedia()`.
- Get and share network information: potential connection endpoints are known as [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) candidates.
- Get and share local and remote descriptions: metadata about local media in [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) format.

- 为每个客户端创建 RTCPeerConnection 实例, 并且在每个端点都通过 `getUserMedia()` 获取本地媒体流。
- 获取并共享网络信息: 潜在的连接端点, 被称为 [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 候选。
- 获取并分享本地和远程的描述信息: [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) 格式的本地 media 元数据。

Imagine that Alice and Bob want to use RTCPeerConnection to set up a video chat.

假设 Alice 和 Bob 想通过 RTCPeerConnection 进行视频聊天。

First up, Alice and Bob exchange network information. The expression 'finding candidates' refers to the process of finding network interfaces and ports using the [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) framework.

首先, Alice 和 Bob 需要交换双方的网络信息。 “寻找候选” 指的是通过 [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 框架来查找可用网络和端口信息的过程。

1. Alice creates an RTCPeerConnection object with an `onicecandidate (addEventListener('icecandidate'))` handler. This corresponds to the following code from **main.js**:

1. Alice 创建一个 RTCPeerConnection 实例, 设置好 `onicecandidate (addEventListener('icecandidate'))` 回调函数。 **main.js**中对应的代码为:

    ```
    let localPeerConnection;
    ```

    以及,


    ```
    localPeerConnection = new RTCPeerConnection(servers);
    localPeerConnection.addEventListener('icecandidate', handleConnection);
    localPeerConnection.addEventListener(
        'iceconnectionstatechange', handleConnectionChange);
    ```



  > The `servers` argument to RTCPeerConnection isn't used in this example.

  > 在本例中, RTCPeerConnection 构造函数的参数 `servers` 是 null。

  > This is where you could specify STUN and TURN servers.

  > 在 `servers` 参数中可以指定 STUN 和 TURN 服务器相关的信息。

  > WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails.

  > WebRTC 是为 peer-to-peer 网络设计的, 所以用户可以在大部分直连的网络中使用. 但现实情况很复杂, WebRTC需要面对的是: 客户端程序需要穿透 [NAT网关](http://en.wikipedia.org/wiki/NAT_traversal) 以及各种防火墙, 在直连失败的情况下, peer-to-peer 网络需要回退策略。

  > As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.

  > 为了解决 peer-to-peer 通信失败的问题,WebRTC API 通过 STUN 服务来获取客户端的公网IP, 使用 TURN 作为中继服务器。更详细的信息请参考: [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) 。

2. Alice calls `getUserMedia()` and adds the stream passed to that:

2. Alice 调用 `getUserMedia()`, 并将获取到的 stream 传递给 localPeerConnection:

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



3. The `onicecandidate` handler from step 1. is called when network candidates become available.
4. Alice sends serialized candidate data to Bob. In a real application, this process (known as **signaling**) takes place via a messaging service – you'll learn how to do that in a later step. Of course, in this step, the two RTCPeerConnection objects are on the same page and can communicate directly with no need for external messaging.
5. When Bob gets a candidate message from Alice, he calls `addIceCandidate()`, to add the candidate to the remote peer description:

3. 在 **step 1** 之中引入的 `onicecandidate` 处理函数, 在网络候选者变得可用时会被调用。
4. Alice 将序列化之后的候选者数据发送给 Bob。这个过程被称为 **signaling**(信令), 在实际应用中, 是通过消息服务来传递的。 在后面的教程中我们会学到. 当然,在本节中, 因为两个 RTCPeerConnection 实例在同一页面中, 所以可以直接通信, 而不再需要外部的消息服务。
5. Bob从Alice获得候选者信息之后, 他调用 `addIceCandidate()`, 将候选信息传递给 remote peer description:

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

1. Alice 执行 RTCPeerConnection 的 `createOffer()` 方法。返回的 promise 中提供了一个 RTCSessionDescription: 即 Alice 的本地会话描述:


    ```
    trace('localPeerConnection createOffer start.');
    localPeerConnection.createOffer(offerOptions)
      .then(createdOffer).catch(setSessionDescriptionError);
    ```



2. If successful, Alice sets the local description using `setLocalDescription()` and then sends this session description to Bob via their signaling channel.
3. Bob sets the description Alice sent him as the remote description using `setRemoteDescription()`.
4. Bob runs the RTCPeerConnection `createAnswer()` method, passing it the remote description he got from Alice, so a local session can be generated that is compatible with hers. The `createAnswer()` promise passes on an RTCSessionDescription: Bob sets that as the local description and sends it to Alice.
5. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription()`. 

2. 如果成功, Alice 使用 `setLocalDescription()` 来设置本地会话信息, 然后通过信令通道, 将这些信息发送给Bob。
3. Bob使用RTCPeerConnection的`setRemoteDescription()`方法, 将Alice传过来的远端会话信息填进去。
4. Bob执行RTCPeerConnection的`createAnswer()`方法, 传入获取到的远端会话信息, 然后就会生成一个和Alice适配的本地会话。`createAnswer()` 方法返回的 promise 会传入一个 RTCSessionDescription 对象: 然后将它设置为本地描述, 并发送给Alice。
5. 当Alice获取到Bob的会话描述信息, 则使用 `setRemoteDescription()` 方法填入远端会话信息。


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



6. Ping!

6. 接通!

## Bonus points

## 加分

1. Take a look at **chrome://webrtc-internals**. This provides WebRTC stats and debugging data. (A full list of Chrome URLs is at **chrome://about**.)
2. Style the page with CSS:

1. 新标签页中打开 **`chrome://webrtc-internals`**。 该页面提供了 WebRTC 相关的统计数据和调试信息。(Chrome 相关的功能url列举在 **`chrome://about`** 之中)
2. 修改页面的CSS样式:

  - Put the videos side by side.
  - Make the buttons the same width, with bigger text.
  - Make sure the layout works on mobile.

  - 将视频并排在一起。
  - 统一按钮的宽高, 使用更大的字号。
  - 适配移动端。

3. From the Chrome Dev Tools console, look at `localStream`, `localPeerConnection` and `remotePeerConnection`.
4. From the console, look at `localPeerConnectionpc1.localDescription`. What does SDP format look like?

3. 在Chrome控制台中(Chrome Dev Tools console), 查看 `localStream`, `localPeerConnection` 和 `remotePeerConnection`对象的信息。
4. 在控制台中, 查看 `localPeerConnectionpc1.localDescription` 。SDP的格式是什么样的?

## What you learned

## 知识点回顾

In this step you learned how to:

在本节课程中, 我们学到了:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.
- Share media and network information between peers to enable a WebRTC call.

- 使用 WebRTC 兼容库来填平浏览器的差异: [adapter.js](https://github.com/webrtc/adapter)。
- 使用RTCPeerConnection API来传输视频流。
- 控制 media 捕捉和传输。
- 在两个端点(peer)之间, 共享 media 和网络信息, 以连通WebRTC通信。

A complete version of this step is in the **step-2** folder.

本节的完整代码位于 **step-2** 文件夹中。


## Tips

## 提示

- There's a lot to learn in this step! To find other resources that explain RTCPeerConnection in more detail, take a look at [webrtc.org/start](https://webrtc.org/start). This page includes suggestions for JavaScript frameworks — if you'd like to use WebRTC, but don't want to wrangle the APIs.
- Find out more about the adapter.js shim from the [adapter.js GitHub repo](https://github.com/webrtc/adapter).
- Want to see what the world's best video chat app looks like? Take a look at AppRTC, the WebRTC project's canonical app for WebRTC calls: [app](https://appr.tc/), [code](https://github.com/webrtc/apprtc). Call setup time is less than 500 ms.

- 本节涉及到了很多知识点! 更多关于 RTCPeerConnection 的内容, 请参考 [webrtc.org/start](https://webrtc.org/start). 里面有一些对于 JavaScript 框架的建议, 如果你只是想使用WebRTC,但不想涉及到API的话。
- 从 [adapter.js GitHub repo](https://github.com/webrtc/adapter) 中阅读更多的信息。
- 想要体验当今世界上最好的WebRTC视频聊天应用吗? 那可以看看 AppRTC, 这是WebRTC项目的标准实现: [app](https://appr.tc/), [code](https://github.com/webrtc/apprtc)。 创建通话的时间可以小于 500 ms。

## Best practice

## 最佳实践

- To future-proof your code, use the new Promise-based APIs and enable compatibility with browsers that don't support them by using [adapter.js](https://github.com/webrtc/adapter).

- 想要代码不会轻易过时, 请使用基于 Promise的API， 并通过 [adapter.js](https://github.com/webrtc/adapter) 来兼容各种浏览器。

## Next up

## 接下来

This step shows how to use WebRTC to stream video between peers — but this codelab is also about data!

本节演示了如何使用WebRTC在端点之间传输视频流 —— 但本教程还要演示如何传输数据!

In the next step find out how to stream arbitrary data using RTCDataChannel.

下一小节, 我们将学习如何使用 RTCDataChannel 来传输任意数据。

