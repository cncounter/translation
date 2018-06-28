# 1. Introduction

# 1. WebRTC简介

WebRTC is an open source project to enable realtime communication of audio, video and data in Web and native apps.

WebRTC 是一个实时通信领域的开源项目, 致力于在Web以及原生App平台上进行语音、视频、数据等方面的实时通讯。

WebRTC has several JavaScript APIs — click the links to see demos.

WebRTC包括下面这些 JavaScript API —— 点击对应的链接可以查看对应的demo。

*   [`getUserMedia()`](https://webrtc.github.io/samples/src/content/getusermedia/gum/): 获取(capture)音频(audio)和视频(video).
*   [`MediaRecorder`](https://webrtc.github.io/samples/src/content/getusermedia/record/): 录制(record)音频(audio)和视频(video).
*   [`RTCPeerConnection`](https://webrtc.github.io/samples/src/content/peerconnection/pc1/): 在用户之间传输音频(audio)和视频(video)流(stream).
*   [`RTCDataChannel`](https://webrtc.github.io/samples/src/content/datachannel/basic/): 在用户之间传输数据流(data stream).


## Where can I use WebRTC?

## WebRTC的平台支持情况

In Firefox, Opera and in Chrome on desktop and Android. WebRTC is also available for native apps on iOS and Android.

当前桌面端和 Android 版本的 Firefox、Opera 以及 Chrome 浏览器都支持WebRTC。 另外、一部分iOS和Android的原生App也支持WebRTC。

> 译者注: 国内使用量巨大的360浏览器、搜狗浏览器兼容性基本和Chrome一致。当然, 应该使用最新的版本(当前时间: 2018年6月28日)。

## What is signaling?

## 信令简介(signaling)

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

