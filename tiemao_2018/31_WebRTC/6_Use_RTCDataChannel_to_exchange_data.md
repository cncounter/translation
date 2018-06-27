## 6. Use RTCDataChannel to exchange data

## What you'll learn

- How to exchange data between WebRTC endpoints (peers).

A complete version of this step is in the **step-03** folder.

## Update your HTML

For this step, you'll use WebRTC data channels to send text between two `textarea` elements on the same page. That's not very useful, but does demonstrate how WebRTC can be used to share data as well as streaming video.

Remove the video and button elements from **index.html** and replace them with the following HTML:

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

**index.html** should now look like this:

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

Replace **main.js** with the contents of **step-03/js/main.js**.

As with the previous step, it's not ideal doing cut-and-paste with large chunks of code in a codelab, but (as with RTCPeerConnection) there's no alternative.

Try out streaming data between peers: open **index.html**, press **Start** to set up the peer connection, enter some text in the `textarea` on the left, then click **Send** to transfer the text using WebRTC data channels.

## How it works

This code uses RTCPeerConnection and RTCDataChannel to enable exchange of text messages.

Much of the code in this step is the same as for the RTCPeerConnection example.

The `sendData()` and `createConnection()` functions have most of the new code:

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

Notice the use of `dataConstraint`. Data channels can be configured to enable different types of data sharing — for example, prioritizing reliable delivery over performance. You can find out more information about options at [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel).

**Three types of constraints**

It's confusing!

Different types of WebRTC call setup options are all often referred to as 'constraints'.

Find out more about constraints and options:

- [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection)
- [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel)
- [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## Bonus points

1. With [SCTP](https://bloggeek.me/sctp-data-channel/), the protocol used by WebRTC data channels, reliable and ordered data delivery is on by default. When might RTCDataChannel need to provide reliable delivery of data, and when might performance be more important — even if that means losing some data?
2. Use CSS to improve page layout, and add a placeholder attribute to the "dataChannelReceive" textarea.
3. Test the page on a mobile device.

## What you learned

In this step you learned how to:

- Establish a connection between two WebRTC peers.
- Exchange text data between the peers.

A complete version of this step is in the **step-03** folder.

## Find out more

- [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/) (a couple of years old, but still worth reading)
- [Why was SCTP Selected for WebRTC's Data Channel?](https://bloggeek.me/sctp-data-channel/)

## Next up

You've learned how to exchange data between peers on the same page, but how do you do this between different machines? First, you need to set up a signaling channel to exchange metadata messages. Find out how in the next step!

