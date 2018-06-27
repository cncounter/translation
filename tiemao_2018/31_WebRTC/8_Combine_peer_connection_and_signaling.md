## 8. Combine peer connection and signaling

## What you'll learn

In this step you'll find out how to:

- Run a WebRTC signaling service using Socket.IO running on Node.js
- Use that service to exchange WebRTC metadata between peers.

A complete version of this step is in the **step-05** folder.

## Replace HTML and JavaScript

Replace the contents of **index.html** with the following:

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

## Run the Node.js server

If you are not following this codelab from your **work** directory, you may need to install the dependencies for the **step-05**folder or your current working folder. Run the following command from your working directory:

```
npm install
```

Once installed, if your Node.js server is not running, start it by calling the following command in the **work** directory:

```
node index.js
```

Make sure you're using the version of **index.js** from the previous step that implements Socket.IO. For more information on Node and Socket IO, review the section "Set up a signaling service to exchange messages".

From your browser, open **localhost:8080**.

Open **localhost:8080** again, in a new tab or window. One video element will display the local stream from `getUserMedia()`and the other will show the 'remote' video streamed via RTCPeerconnection.

You'll need to restart your Node.js server each time you close a client tab or window.

View logging in the browser console.

### **Bonus points**

1. This application supports only one-to-one video chat. How might you change the design to enable more than one person to share the same video chat room?
2. The example has the room name *foo* hard coded. What would be the best way to enable other room names?
3. How would users share the room name? Try to build an alternative to sharing room names.
4. How could you change the app

## What you learned

In this step you learned how to:

- Run a WebRTC signaling service using Socket.IO running on Node.js.
- Use that service to exchange WebRTC metadata between peers.

A complete version of this step is in the **step-05** folder.

## Tips

- WebRTC stats and debug data are available from **chrome://webrtc-internals**.
- [test.webrtc.org](https://test.webrtc.org/) can be used to check your local environment and test your camera and microphone.
- If you have odd troubles with caching, try the following:
- Do a hard refresh by holding down ctrl and clicking the **Reload** button
- Restart the browser
- Run `npm cache clean` from the command line.

## Next up

Find out how to take a photo, get the image data, and share that between remote peers.

