# 1. Introduction

# WebRTC基础实践 - 1. WebRTC简介

WebRTC is an open source project to enable realtime communication of audio, video and data in Web and native apps.

WebRTC 是一个开源的实时通信项目, 主要目标是对Web/原生App平台上的语音、视频、以及数据传输等实时通讯提供支持。

WebRTC has several JavaScript APIs — click the links to see demos.

WebRTC 主要包括以下 JavaScript API(点击链接可查看相关demo)。

*   [`getUserMedia()`](https://webrtc.github.io/samples/src/content/getusermedia/gum/): 获取用户设备的音频和视频.
*   [`MediaRecorder`](https://webrtc.github.io/samples/src/content/getusermedia/record/): 录制音频和视频.
*   [`RTCPeerConnection`](https://webrtc.github.io/samples/src/content/peerconnection/pc1/): 流式传输两个客户端之间的音频与视频.
*   [`RTCDataChannel`](https://webrtc.github.io/samples/src/content/datachannel/basic/): 在两个客户端之间传输数据流.


## Where can I use WebRTC?

## WebRTC的平台支持情况

In Firefox, Opera and in Chrome on desktop and Android. WebRTC is also available for native apps on iOS and Android.

目前, PC版和Android版的 Firefox、Opera 和 Chrome 浏览器都支持WebRTC。 此外、iOS和Android的一些原生App也支持WebRTC。

> 译者注: 国内使用量巨大的360浏览器、搜狗浏览器兼容性基本和Chrome一致。当然, 推荐使用最新的版本(当前时间: 2018年6月28日)。

## What is signaling?

## 信令(signaling)

WebRTC uses RTCPeerConnection to communicate streaming data between browsers, but also needs a mechanism to coordinate communication and to send control messages, a process known as signaling. Signaling methods and protocols are not specified by WebRTC. In this codelab you will use Socket.IO for messaging, but there are [many alternatives](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md).

WebRTC 通过 RTCPeerConnection 在浏览器之间进行流数据传输, 但还需要一种机制, 来协调通信以及发送控制指令, 这个过程就叫做信令控制. WebRTC 没有规定具体使用的协议或方法。

在本教程中, 我们使用 Socket.IO 来传递消息, 当然也可以使用 [其他实现](https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Signaling.md)。

## What are STUN and TURN?

## STUN和TURN简介

WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. However, WebRTC is built to cope with real-world networking: client applications need to traverse [NAT gateways](http://en.wikipedia.org/wiki/NAT_traversal) and firewalls, and peer to peer networking needs fallbacks in case direct connection fails. As part of this process, the WebRTC APIs use STUN servers to get the IP address of your computer, and TURN servers to function as relay servers in case peer-to-peer communication fails. ([WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) explains in more detail.)

WebRTC 是基于点对点(peer-to-peer)网络设计的, 在理想环境中, 双方通过路由器进行直连. 但在现实世界中, 两个客户端之间, 需要穿透防火墙以及 [NAT 网关](http://en.wikipedia.org/wiki/NAT_traversal), 如果直连失败, 则需要回退降级。所以, 为了应对各种复杂的网络环境, WebRTC API 需要使用 STUN 服务器的帮助, 来获取双方的公网IP, 如果对等连接失败, 则需要使用 TURN 服务器作为中继服务器. 现实世界中的网络环境是什么样子的呢, 请参考 [WebRTC in the real world](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)

## Is WebRTC secure?

## WebRTC的安全性

Encryption is mandatory for all WebRTC components, and its JavaScript APIs can only be used from secure origins (HTTPS or localhost). Signaling mechanisms aren't defined by WebRTC standards, so it's up to you make sure to use secure protocols.

WebRTC的所有组件强制加密. 相关的JavaScript API也只能在安全的域名中使用(即 HTTPS 或者 localhost). 但WebRTC标准没有指定信令机制, 所以需要开发者确保使用了安全传输协议。

Looking for more? Check out the resources at [webrtc.org/start](http://webrtc.org/start).

更多信息和资源, 请参考: <http://webrtc.org/start>


## 相关词汇对照:

- `capture` : 获取、抓取
- `audio` : 音频
- `video` : 视频
- `stream` : 流
- `data stream` : 数据流
- `record` : 录制、记录
- `signaling` : 信令
- `Encryption` : 加密
- `relay server` : 中继服务器
- `peer-to-peer`: 点对点网络


原文链接: <https://codelabs.developers.google.com/codelabs/webrtc-web/#0>

翻译人员: 铁锚 - <https://blog.csdn.net/renfufei>

翻译日期: 2018年06月28日
