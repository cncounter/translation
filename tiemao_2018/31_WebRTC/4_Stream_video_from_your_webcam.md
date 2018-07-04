## 4. Stream video from your webcam


## What you'll learn

In this step you'll find out how to:

*   Get a video stream from your webcam.
*   Manipulate stream playback.
*   Use CSS and SVG to manipulate video.

A complete version of this step is in the `step-01` folder.


## A dash of HTML...

Add a `video` element and a `script` element to `index.html` in your `work` directory:

```
<!DOCTYPE html>
<html>
<head>
  <title>Realtime communication with WebRTC</title>
  <link rel="stylesheet" href="css/main.css" />
</head>

<body>
  <h1>Realtime communication with WebRTC</h1>
  <video autoplay playsinline></video>
  <script src="js/main.js"></script>
</body>

</html>
```

## ...and a pinch of JavaScript

Add the following to **main.js** in your **js** folder:

```
'use strict';

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
  video: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
```

> All the JavaScript examples here use `'use strict';` to avoid common coding gotchas.

> Find out more about what that means in [ECMAScript 5 Strict Mode, JSON, and More](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/).


## Try it out

Open `index.html` in your browser and you should see something like this (featuring the view from your webcam, of course!):

![](04_01_demo.png)


## How it works

Following the `getUserMedia()` call, the browser requests permission from the user to access their camera (if this is the first time camera access has been requested for the current origin). If successful, a [MediaStream](https://developer.mozilla.org/en/docs/Web/API/MediaStream) is returned, which can be used by a media element via the `srcObject` attribute:

```
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

}
```

```
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
}
```

The `constraints` argument allows you to specify what media to get. In this example, video only, since audio is disabled by default:

```
const mediaStreamConstraints = {
  video: true,
};
```

You can use constraints for additional requirements such as video resolution:

```
const hdConstraints = {
  video: {
    width: {
      min: 1280
    },
    height: {
      min: 720
    }
  }
}
```

The [MediaTrackConstraints specification](https://w3c.github.io/mediacapture-main/getusermedia.html#media-track-constraints) lists all potential constraint types, though not all options are supported by all browsers. If the resolution requested isn't supported by the currently selected camera, `getUserMedia()` will be rejected with an `OverconstrainedError` and the user will not be prompted to give permission to access their camera.

> You can view a demo showing how to use constraints to request different resolutions [here](https://simpl.info/getusermedia/constraints/), and a demo using constraints to choose camera and microphone [here](https://simpl.info/getusermedia/sources/).

If `getUserMedia()` is successful, the video stream from the webcam is set as the source of the video element:

```
function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
}
```


## Bonus points

*   The `localStream` object passed to `getUserMedia()` is in global scope, so you can inspect it from the browser console: open the console, type _stream_ and press Return. (To view the console in Chrome, press Ctrl-Shift-J, or Command-Option-J if you're on a Mac.)
*   What does `localStream.getVideoTracks()` return?
*   Try calling `localStream.getVideoTracks()[0].stop()`.
*   Look at the constraints object: what happens when you change it to `{audio: true, video: true}`?
*   What size is the video element? How can you get the video's natural size from JavaScript, as opposed to display size? Use the Chrome Dev Tools to check.*   Try adding CSS filters to the video element. For example:

```
video {
  filter: blur(4px) invert(1) opacity(0.5);
}
```

*   Try adding SVG filters. For example:

```
video {
   filter: hue-rotate(180deg) saturate(200%);
}
```

## What you learned

In this step you learned how to:

*   Get video from your webcam.
*   Set media constraints.
*   Mess with the video element.

A complete version of this step is in the **step-01** folder.

## Tips

*   Don't forget the `autoplay` attribute on the `video` element. Without that, you'll only see a single frame!
*   There are lots more options for `getUserMedia()` constraints. Take a look at the demo at [webrtc.github.io/samples/src/content/peerconnection/constraints](https://webrtc.github.io/samples/src/content/peerconnection/constraints/). As you'll see, there are lots of interesting WebRTC samples on that site.

## Best practice

*   Make sure your video element doesn't overflow its container. We've added `width` and `max-width` to set a preferred size and a maximum size for the video. The browser will calculate the height automatically:

```
video {
  max-width: 100%;
  width: 320px;
}
```

## Next up

You've got video, but how do you stream it? Find out in the next step!

