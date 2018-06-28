# 1. Introduction

# 1. WebRTC简介

WebRTC is an open source project to enable realtime communication of audio, video and data in Web and native apps.

WebRTC是一个开源项目,使实时通讯的音频、视频和数据在网络和本地应用。

WebRTC has several JavaScript APIs — click the links to see demos.

WebRTC有几个JavaScript api——点击链接查看演示。

*   [`getUserMedia()`](https://webrtc.github.io/samples/src/content/getusermedia/gum/): capture audio and video.
*   [`MediaRecorder`](https://webrtc.github.io/samples/src/content/getusermedia/record/): record audio and video.
*   [`RTCPeerConnection`](https://webrtc.github.io/samples/src/content/peerconnection/pc1/): stream audio and video between users.
*   [`RTCDataChannel`](https://webrtc.github.io/samples/src/content/datachannel/basic/): stream data between users.

*(`getUserMedia()`)(https://webrtc.github.io/samples/src/content/getusermedia/gum/):捕捉音频和视频。
*(`MediaRecorder`)(https://webrtc.github.io/samples/src/content/getusermedia/record/):记录音频和视频。
*(`RTCPeerConnection`)(https://webrtc.github.io/samples/src/content/peerconnection/pc1/):流之间的音频和视频的用户。
*(`RTCDataChannel`)(https://webrtc.github.io/samples/src/content/datachannel/basic/):用户之间的流数据。

## Where can I use WebRTC?

## 我在哪里可以用WebRTC吗?

In Firefox, Opera and in Chrome on desktop and Android. WebRTC is also available for native apps on iOS and Android.

在Firefox、Opera和铬在桌面和Android。WebRTC也可以,Android和iOS上的本地应用。

## What is signaling?

## 信号是什么?

WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. Signaling methods and protocols are not specified by WebRTC. In this codelab you will use Socket.IO for messaging, but there are [many alternatives](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md).

WebRTC uses RTCPeerConnection browsers之间streaming数据监测to,需要密切沟通机制的信息,向control and to a process被称为“signaling.Signaling方法和议定书的WebRTC进行解读。codelab In this you will使用公钥。这次,目的在messaging for https://github arhuaca[替代](.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md)。

## What are STUN and TURN?

## 眩晕,将是什么?

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails. As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. ([WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.)

WebRTC设计点对点工作,所以用户可以连接的最直接的路线.然而,各种基本WebRTC is to用武之地:与real-world networking客户需要穿过应用http://en.wikipedia]([NAT网关.org/wiki/NAT_traversal)和防火墙,和点对点网络需要回退,以防直接连接失败.作为这个过程的一部分,WebRTC api使用眩晕服务器计算机的IP地址,并将服务器作为中继服务器的对等通信失败.在现实世界中([WebRTC)(http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)更详细地解释。)

## Is WebRTC secure?

## WebRTC安全吗?

Encryption is mandatory for all WebRTC components, and its JavaScript APIs can only be used from secure origins (HTTPS or localhost). Signaling mechanisms aren't defined by WebRTC standards, so it's up to you make sure to use secure protocols.

.信号机制不是WebRTC所定义的标准,所以由你确保使用安全协议。

Looking for more? Check out the resources at [webrtc.org/start](http://webrtc.org/start).

寻找更多的吗?查看资源[webrtc.org/start](http://webrtc.org/start)。

