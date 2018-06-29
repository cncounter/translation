# 1. Introduction

# 1. WebRTC简介

WebRTC is an open source project to enable realtime communication of audio, video and data in Web and native apps.

WebRTC 是实时通信领域的一个开源项目, 致力于在Web/原生App平台进行语音、视频、数据等方面的实时通讯。

WebRTC has several JavaScript APIs — click the links to see demos.

WebRTC 主要包括以下 JavaScript API —— 点击对应的链接可以查看相关demo。

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

## 信令(signaling)

WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. Signaling methods and protocols are not specified by WebRTC. In this codelab you will use Socket.IO for messaging, but there are [many alternatives](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md).

WebRTC 通过 RTCPeerConnection 在浏览器之间进行数据流的传输, 但也需要一种机制来进行通信协调以及发送控制消息, 这个过程就叫信令(signaling). WebRTC 并没有规定信令使用什么协议以及如何实现。在此 codelab 中你可以使用 Socket.IO 来传递消息, 当然也可以使用其他的各种实现: [many alternatives](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md)。

## What are STUN and TURN?

## STUN和TURN

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails. As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. ([WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.)

WebRTC 基于点对点(peer-to-peer)网络设计, 理想状态下, 双方通过网络路由器直连. 但实际呢, 客户端需要穿过各种防火墙以及 [NAT 网关](http://en.wikipedia.org/wiki/NAT_traversal), 如果直连失败, 则需要回退降级。所以呢, 为了对付这种复杂的网络环境, WebRTC API 需要使用 STUN服务器来获取双方计算机的IP地址, 如果对等通信失败,则使用 TURN 服务器作为中继(relay server). 现实世界中的网络环境是什么样子的, 请参考 [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)

## Is WebRTC secure?

## WebRTC的安全性

Encryption is mandatory for all WebRTC components, and its JavaScript APIs can only be used from secure origins (HTTPS or localhost). Signaling mechanisms aren't defined by WebRTC standards, so it's up to you make sure to use secure protocols.

WebRTC的所有组件强制加密. 相关的JavaScript API也只能在安全网站使用(即 HTTPS or localhost). 但WebRTC没有指定信令机制, 所以需要开发者确保使用安全传输协议。

Looking for more? Check out the resources at [webrtc.org/start](http://webrtc.org/start).

更多信息和资源, 请参考: [webrtc.org/start](http://webrtc.org/start)。

