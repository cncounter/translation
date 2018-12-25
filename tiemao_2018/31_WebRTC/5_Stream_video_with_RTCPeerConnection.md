## 5. Stream video with RTCPeerConnection

## WebRTC基础实践 - 5.通过RTCPeerConnection传输流媒体视频

## What you'll learn

## 本节内容

In this step you'll find out how to:

在本节课程中, 我们将学习以下内容:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.

- 使用WebRTC兼容库: [adapter.js](https://github.com/webrtc/adapter), 来抹平各浏览器间的差异。
- 通过 RTCPeerConnection API 传输流媒体视频。
- 控制 media 的捕捉和传输。

A complete version of this step is in the **step-2** folder.

本节的完整版代码位于 `step-02` 文件夹中。

## What is RTCPeerConnection?

## RTCPeerConnection 简介

RTCPeerConnection is an API for making WebRTC calls to stream video and audio, and exchange data.

在WebRTC规范中, `RTCPeerConnection`用于视频流/音频流、以及数据的传输。

This example sets up a connection between two RTCPeerConnection objects (known as peers) on the same page.

下面的示例程序, 将会在一个页面上, 通过两个 RTCPeerConnection 对象建立一个连接通道。

Not much practical use, but good for understanding how RTCPeerConnection works.

这个demo本身没什么实用价值, 目的只是为了理解 RTCPeerConnection 的原理。

## Add video elements and control buttons

## 添加`video`元素及控制按钮

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

第一个 video 元素(`id="localVideo"`)用于展示通过 `getUserMedia()` 获取到的本地视频流, 第二个 video 元素(`id="remoteVideo"`)则通过RTCPeerconnection, 接收并显示同样的视频。在实际应用中, 页面中一般都有两个 video 元素:  一个用来展示本地视频, 另一个用来播放远程传输过来的视频( 可以参考微信视频通话界面, 其中有一大一小,两个视频展示窗口 )。

## Add the adapter.js shim

## 添加 adapter.js 兼容库

Add a link to the current version of [**adapter.js**](https://github.com/webrtc/adapter)** **above the link to **main.js**:

在 **main.js** 引用的前面, 引入 [**adapter.js**](https://github.com/webrtc/adapter) 的最新版本:

```
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
```



**adapter.js** is a shim to insulate apps from spec changes and prefix differences. (Though in fact, the standards and protocols used for WebRTC implementations are highly stable, and there are only a few prefixed names.)

**adapter.js** 是一个适配程序, 隔离了应用程序和规范之间的变更、前缀等差异.(当然, WebRTC实现所使用的标准和协议都已经是稳定版了, 有前缀的API也没几个。)

In this step, we've linked to the most recent version of **adapter.js**, which is fine for a codelab but not may not be right for a production app**. **The [adapter.js GitHub repo](https://github.com/webrtc/adapter) explains techniques for making sure your app always accesses the most recent version.

在本节课程中, 我们引入了 **adapter.js** 的最新版本。这个库对于实验和教程来说足够用了, 但如果想用于生产环境, 可能还需要进一步完善。 `adapter.js` 的地址为:  <https://github.com/webrtc/adapter>, Github提供的服务让我们可以使用到最新的版本。

For full information about WebRTC interop, see [webrtc.org/web-apis/interop](https://webrtc.org/web-apis/interop/).

WebRTC 详细的交互日志, 请参考: <https://webrtc.org/web-apis/interop/>。

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

使用 `step-02/main.js` 文件替换 `work/main.js` 文件。

It's not ideal doing cut-and-paste with large chunks of code in a codelab, but in order to get RTCPeerConnection up and running, there's no alternative but to go the whole hog.

按道理来说,在demo教程中,是不应该存在这种大量的复制粘贴行为的, 但没办法, RTCPeerConnection 相关的代码是一个整体, 要跑起来就必须全部配置好才行。

You'll learn how the code works in a moment.

下面我们对代码进行详细的讲解。

## Make the call

## 拨打视频通话

Open **index.html**, click the **Start** button to get video from your webcam, and click **Call** to make the peer connection. You should see the same video (from your webcam) in both video elements. View the browser console to see WebRTC logging.

浏览器中通过http协议打开 **index.html**页面, 单击 **Start** 按钮获取摄像头的视频, 之后点击 **Call** 按钮来建立对等连接(peer connection)。 如果连接成功, 那么就可以在两个 video 中中看到同样的画面.  请打开浏览器的控制台, 查看 WebRTC 相关的日志信息。

## How it works

## 原理简介

This step does a lot...

这一步做了很多的操作...

> **If you want to skip the explanation below, that's fine.**

> **You can still continue with the codelab!**

> **具体的内容比较复杂, 如果不关心实现过程, 可直接跳到下一节。**

> **跳过下面的步骤, 依然可以进行该教程的学习!**

WebRTC uses the RTCPeerConnection API to set up a connection to stream video between WebRTC clients, known as **peers**.

通过 RTCPeerConnection, 可以在 WebRTC 客户端之间创建连接, 来传输流媒体视频, 每个客户端就是一个端点(**peer**)。

In this example, the two RTCPeerConnection objects are on the same page: `pc1` and `pc2`. Not much practical use, but good for demonstrating how the APIs work.

本节的示例中, 两个 RTCPeerConnection 对象在同一个页面中: 即 `pc1` 和 `pc2`。 所以并没有什么实际价值, 只是用来演示api的使用。

Setting up a call between WebRTC peers involves three tasks:

在 WebRTC 客户端之间创建视频通话, 需要执行三个步骤:

- Create a RTCPeerConnection for each end of the call and, at each end, add the local stream from `getUserMedia()`.
- Get and share network information: potential connection endpoints are known as [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) candidates.
- Get and share local and remote descriptions: metadata about local media in [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) format.

- 为每个客户端创建一个 RTCPeerConnection 实例, 并且通过 `getUserMedia()` 获取本地媒体流。
- 获取网络信息并发送给对方: 有可能成功的连接点(endpoint), 被称为 [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 候选。
- 获取本地和远程描述信息并分享: [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) 格式的本地 media 元数据。

Imagine that Alice and Bob want to use RTCPeerConnection to set up a video chat.

假设 Alice 和 Bob 想通过 RTCPeerConnection 进行视频通话。

First up, Alice and Bob exchange network information. The expression 'finding candidates' refers to the process of finding network interfaces and ports using the [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) framework.

首先, Alice 和 Bob 需要交换双方的网络信息。 “寻找候选” 指的是通过 [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 框架来查找可用网络和端口信息的过程。 可以分为以下步骤:

1. Alice creates an RTCPeerConnection object with an `onicecandidate (addEventListener('icecandidate'))` handler. This corresponds to the following code from **main.js**:

1. Alice 创建一个 RTCPeerConnection 对象, 设置好 `onicecandidate` 回调 [即 `addEventListener('icecandidate', XXX)`] 。 在 **main.js** 中对应的代码为:

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

  > 在本例中, RTCPeerConnection 构造函数的 `servers` 参数为 null。

  > This is where you could specify STUN and TURN servers.

  > 在 `servers` 参数中, 可以指定 STUN 和 TURN 服务器相关的信息。

  > WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails.

  > WebRTC 是为 peer-to-peer 网络设计的, 所以用户可以在大部分可以直连的网络中使用. 但现实情况非常复杂, WebRTC面临的真实环境是: 客户端程序需要穿透 [NAT网关](http://en.wikipedia.org/wiki/NAT_traversal) ,以及各类防火墙。 所以在直连失败的情况下, peer-to-peer 网络需要一种回退措施。

  > As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.

  > 为了解决 peer-to-peer 直连通信失败的问题, WebRTC 通过 STUN 服务来获取客户端的公网IP, 并使用 TURN 作为中继服务器。 详细信息请参考: [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) 。

2. Alice calls `getUserMedia()` and adds the stream passed to that:

2. Alice 调用 `getUserMedia()`, 将获取到的本地 stream 传给 localVideo:

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

3. 在网络候选者变为可用时, 步骤1中引入的 `onicecandidate` 回调函数, 会被执行。
4. Alice 将序列化之后的候选者信息发送给 Bob。这个过程被称为 **signaling**(信令), 实际应用中, 会通过消息服务来传递。 在后面的教程中会看到. 当然,在本节中, 因为两个 RTCPeerConnection 实例处于同一个页面, 所以可以直接通信, 不再需要外部消息服务。
5. Bob从Alice处获得候选者信息后, 调用 `addIceCandidate()` 方法, 将候选信息传给 remote peer description:

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

WebRTC客户端还需要获取本地和远程的音频/视频媒体信息, 比如分辨率、编码/解码器的能力等等. 交换媒体配置信息的信令过程, 是通过交换元数据的blob数据进行的, 即一次 **offer** 与一次 **answer**, 使用会话描述协议(Session Description Protocol), 简称 [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol):

1. Alice runs the RTCPeerConnection `createOffer()` method. The promise returned provides an RTCSessionDescription: Alice's local session description:

1. Alice 执行 RTCPeerConnection 的 `createOffer()` 方法。返回的 promise 中提供了一个 RTCSessionDescription 对象: 其中包含 Alice 本地的会话描述信息:


    ```
    trace('localPeerConnection createOffer start.');
    localPeerConnection.createOffer(offerOptions)
      .then(createdOffer).catch(setSessionDescriptionError);
    ```



2. If successful, Alice sets the local description using `setLocalDescription()` and then sends this session description to Bob via their signaling channel.
3. Bob sets the description Alice sent him as the remote description using `setRemoteDescription()`.
4. Bob runs the RTCPeerConnection `createAnswer()` method, passing it the remote description he got from Alice, so a local session can be generated that is compatible with hers. The `createAnswer()` promise passes on an RTCSessionDescription: Bob sets that as the local description and sends it to Alice.
5. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription()`. 

2. 如果执行成功, Alice 通过 `setLocalDescription()` 方法将本地会话信息保存, 接着通过信令通道, 将这些信息发送给Bob。
3. Bob使用RTCPeerConnection的`setRemoteDescription()`方法, 将Alice传过来的远端会话信息填进去。
4. Bob执行RTCPeerConnection的`createAnswer()`方法, 传入获取到的远端会话信息, 然后就会生成一个和Alice适配的本地会话。 `createAnswer()` 方法返回的 promise 会传入一个 RTCSessionDescription 对象:  Bob将它设置为本地描述, 当然也需要发送给Alice。
5. 当Alice获取到Bob的会话描述信息之后, 使用 `setRemoteDescription()` 方法将远端会话信息设置进去。


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

6. 然后, 视频会话就接通了!

## Bonus points

## 练习与实践

1. Take a look at **chrome://webrtc-internals**. This provides WebRTC stats and debugging data. (A full list of Chrome URLs is at **chrome://about**.)
2. Style the page with CSS:

1. 在一个新标签页中打开 **`chrome://webrtc-internals`**。 该页面提供了 WebRTC 相关的统计数据和调试信息。(Chrome 相关的功能url列举在 **`chrome://about`** 之中)
2. 修改页面的CSS样式:

  - Put the videos side by side.
  - Make the buttons the same width, with bigger text.
  - Make sure the layout works on mobile.

  - 将视频并排在一起。
  - 统一按钮的宽高, 使用更大的字号。
  - 适配移动端。

3. From the Chrome Dev Tools console, look at `localStream`, `localPeerConnection` and `remotePeerConnection`.
4. From the console, look at `localPeerConnectionpc1.localDescription`. What does SDP format look like?

3. 在Chrome控制台中(Chrome Dev Tools console), 查看 `localStream`, `localPeerConnection` 和 `remotePeerConnection` 对象。
4. 在控制台中, 查看 `localPeerConnectionpc1.localDescription`。看看 SDP 格式具体是什么样的?

## What you learned

## 知识点回顾

In this step you learned how to:

在本节课程中, 我们学习了:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.
- Share media and network information between peers to enable a WebRTC call.

- 使用WebRTC兼容库: [adapter.js](https://github.com/webrtc/adapter), 来抹平各浏览器间的差异。
- 通过 RTCPeerConnection API 传输流媒体视频。
- 控制 media 的捕捉和传输。
- 在两个端点(peer)间共享 media 和网络信息, 以接通WebRTC视频通话。

A complete version of this step is in the **step-2** folder.

本节的完整版代码位于 `step-02` 文件夹中。


## Tips

## 提示

- There's a lot to learn in this step! To find other resources that explain RTCPeerConnection in more detail, take a look at [webrtc.org/start](https://webrtc.org/start). This page includes suggestions for JavaScript frameworks — if you'd like to use WebRTC, but don't want to wrangle the APIs.
- Find out more about the adapter.js shim from the [adapter.js GitHub repo](https://github.com/webrtc/adapter).
- Want to see what the world's best video chat app looks like? Take a look at AppRTC, the WebRTC project's canonical app for WebRTC calls: [app](https://appr.tc/), [code](https://github.com/webrtc/apprtc). Call setup time is less than 500 ms.

- 本节涉及到很多知识点! 关于 RTCPeerConnection 的更多信息, 请参考 [webrtc.org/start](https://webrtc.org/start). 里面有一些对 JavaScript 框架的建议, 如果想使用WebRTC, 也想深入了解API细节的话。
- 参考 [adapter.js GitHub repo](https://github.com/webrtc/adapter) 仓库, 获取更多信息。
- 如果想要体验当下最先进的WebRTC视频通话应用, 可以看看 AppRTC, 这也是WebRTC项目的标准实现:  app访问地址: <https://appr.tc/>, 代码地址 <https://github.com/webrtc/apprtc>。 创建通话的时间可以控制在 500 ms以内。

## Best practice

## 最佳实践

- To future-proof your code, use the new Promise-based APIs and enable compatibility with browsers that don't support them by using [adapter.js](https://github.com/webrtc/adapter).

- 想要让代码跟上时代的部分, 请使用基于Promise的API, 并通过 [adapter.js](https://github.com/webrtc/adapter) 来兼容各种浏览器。

## Next up

## 后续内容

This step shows how to use WebRTC to stream video between peers — but this codelab is also about data!

本节演示了在两个WebRTC端点之间传输视频流 —— 后续小节将会展示如何传输数据!

In the next step find out how to stream arbitrary data using RTCDataChannel.

接下来, 我们将学习 RTCDataChannel, 并用它来传输任意的数据内容。



原文链接: <https://codelabs.developers.google.com/codelabs/webrtc-web/#4>

翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

翻译日期: 2018年07月12日
