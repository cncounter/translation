## 5. Stream video with RTCPeerConnection

## What you'll learn

In this step you'll find out how to:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.

A complete version of this step is in the **step-2** folder.

## What is RTCPeerConnection?

RTCPeerConnection is an API for making WebRTC calls to stream video and audio, and exchange data.

This example sets up a connection between two RTCPeerConnection objects (known as peers) on the same page.

Not much practical use, but good for understanding how RTCPeerConnection works.

## Add video elements and control buttons

In **index.html** replace the single video element with two video elements and three buttons:

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

## Add the adapter.js shim

Add a link to the current version of [**adapter.js**](https://github.com/webrtc/adapter)** **above the link to **main.js**:

```
<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
```

**adapter.js** is a shim to insulate apps from spec changes and prefix differences. (Though in fact, the standards and protocols used for WebRTC implementations are highly stable, and there are only a few prefixed names.)

In this step, we've linked to the most recent version of **adapter.js**, which is fine for a codelab but not may not be right for a production app**. **The [adapter.js GitHub repo](https://github.com/webrtc/adapter) explains techniques for making sure your app always accesses the most recent version.

For full information about WebRTC interop, see [webrtc.org/web-apis/interop](https://webrtc.org/web-apis/interop/).

**Index.html** should now look like this:

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

Replace **main.js **with the version in the **step-02** folder.

It's not ideal doing cut-and-paste with large chunks of code in a codelab, but in order to get RTCPeerConnection up and running, there's no alternative but to go the whole hog.

You'll learn how the code works in a moment.

## Make the call

Open **index.html**, click the **Start** button to get video from your webcam, and click **Call** to make the peer connection. You should see the same video (from your webcam) in both video elements. View the browser console to see WebRTC logging.

## How it works

This step does a lot...

**If you want to skip the explanation below, that's fine.**

**You can still continue with the codelab!**

WebRTC uses the RTCPeerConnection API to set up a connection to stream video between WebRTC clients, known as **peers**.

In this example, the two RTCPeerConnection objects are on the same page: `pc1` and `pc2`. Not much practical use, but good for demonstrating how the APIs work.

Setting up a call between WebRTC peers involves three tasks:

- Create a RTCPeerConnection for each end of the call and, at each end, add the local stream from `getUserMedia()`.
- Get and share network information: potential connection endpoints are known as [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) candidates.
- Get and share local and remote descriptions: metadata about local media in [SDP](http://en.wikipedia.org/wiki/Session_Description_Protocol) format.

Imagine that Alice and Bob want to use RTCPeerConnection to set up a video chat.

First up, Alice and Bob exchange network information. The expression 'finding candidates' refers to the process of finding network interfaces and ports using the [ICE](http://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) framework.

1. Alice creates an RTCPeerConnection object with an `onicecandidate (addEventListener('icecandidate'))` handler. This corresponds to the following code from **main.js**:

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

This is where you could specify STUN and TURN servers.

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails.

As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.

1. Alice calls `getUserMedia()` and adds the stream passed to that:

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

1. Alice runs the RTCPeerConnection `createOffer()` method. The promise returned provides an RTCSessionDescription: Alice's local session description:

```
trace('localPeerConnection createOffer start.');
localPeerConnection.createOffer(offerOptions)
  .then(createdOffer).catch(setSessionDescriptionError);
```

1. If successful, Alice sets the local description using `setLocalDescription()` and then sends this session description to Bob via their signaling channel.
2. Bob sets the description Alice sent him as the remote description using `setRemoteDescription()`.
3. Bob runs the RTCPeerConnection `createAnswer()` method, passing it the remote description he got from Alice, so a local session can be generated that is compatible with hers. The `createAnswer()` promise passes on an RTCSessionDescription: Bob sets that as the local description and sends it to Alice.
4. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription()`. 

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

## Bonus points

1. Take a look at **chrome://webrtc-internals**. This provides WebRTC stats and debugging data. (A full list of Chrome URLs is at **chrome://about**.)
2. Style the page with CSS:

- Put the videos side by side.
- Make the buttons the same width, with bigger text.
- Make sure the layout works on mobile.

1. From the Chrome Dev Tools console, look at `localStream`, `localPeerConnection` and `remotePeerConnection`.
2. From the console, look at `localPeerConnectionpc1.localDescription`. What does SDP format look like?

## What you learned

In this step you learned how to:

- Abstract away browser differences with the WebRTC shim, [adapter.js](https://github.com/webrtc/adapter).
- Use the RTCPeerConnection API to stream video.
- Control media capture and streaming.
- Share media and network information between peers to enable a WebRTC call.

A complete version of this step is in the **step-2** folder.

## Tips

- There's a lot to learn in this step! To find other resources that explain RTCPeerConnection in more detail, take a look at [webrtc.org/start](https://webrtc.org/start). This page includes suggestions for JavaScript frameworks — if you'd like to use WebRTC, but don't want to wrangle the APIs.
- Find out more about the adapter.js shim from the [adapter.js GitHub repo](https://github.com/webrtc/adapter).
- Want to see what the world's best video chat app looks like? Take a look at AppRTC, the WebRTC project's canonical app for WebRTC calls: [app](https://appr.tc/), [code](https://github.com/webrtc/apprtc). Call setup time is less than 500 ms.

## Best practice

- To future-proof your code, use the new Promise-based APIs and enable compatibility with browsers that don't support them by using [adapter.js](https://github.com/webrtc/adapter).

## Next up

This step shows how to use WebRTC to stream video between peers — but this codelab is also about data!

In the next step find out how to stream arbitrary data using RTCDataChannel.

