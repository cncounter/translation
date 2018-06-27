# 1. Introduction

WebRTC is an open source project to enable realtime communication of audio, video and data in Web and native apps.

WebRTC has several JavaScript APIs — click the links to see demos.

*   [`getUserMedia()`](https://webrtc.github.io/samples/src/content/getusermedia/gum/): capture audio and video.
*   [`MediaRecorder`](https://webrtc.github.io/samples/src/content/getusermedia/record/): record audio and video.
*   [`RTCPeerConnection`](https://webrtc.github.io/samples/src/content/peerconnection/pc1/): stream audio and video between users.
*   [`RTCDataChannel`](https://webrtc.github.io/samples/src/content/datachannel/basic/): stream data between users.

## Where can I use WebRTC?

In Firefox, Opera and in Chrome on desktop and Android. WebRTC is also available for native apps on iOS and Android.

## What is signaling?

WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. Signaling methods and protocols are not specified by WebRTC. In this codelab you will use Socket.IO for messaging, but there are [many alternatives](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md).

## What are STUN and TURN?

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails. As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. ([WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.)

## Is WebRTC secure?

Encryption is mandatory for all WebRTC components, and its JavaScript APIs can only be used from secure origins (HTTPS or localhost). Signaling mechanisms aren't defined by WebRTC standards, so it's up to you make sure to use secure protocols.

Looking for more? Check out the resources at [webrtc.org/start](http://webrtc.org/start).