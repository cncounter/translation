# 2. Overview

# 2. WebRTC课程概述

Build an app to get video and take snapshots with your webcam and share them peer-to-peer via WebRTC. Along the way you'll learn how to use the core WebRTC APIs and set up a messaging server using Node.js.

本文介绍如何开发一个 WebRTC 应用, 利用网络摄像头(webcam)来执行 拍照、录像、并通过 peer-to-peer 网络传递这些数据. 在此过程中, 我们将学习WebRTC的核心API及基本用法, 还会介绍怎样使用 Node.js 搭建消息服务器。

## What you'll learn

## 本文讲述以下知识点

*   Get video from your webcam
*   Stream video with RTCPeerConnection
*   Stream data with RTCDataChannel
*   Set up a signaling service to exchange messages
*   Combine peer connection and signaling
*   Take a photo and share it via a data channel

* 从摄像头获取视频
* 通过 RTCPeerConnection 传输视频流
* 通过 RTCDataChannel 传输数据流
* 配置信令服务来交换消息
* 集成对等连接与信令
* 拍照, 并通过 data channel 来分享

## What you'll need

## 环境与准备

*   Chrome 47 or above
*   [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb), or use your own web server of choice.
*   The sample code
*   A text editor
*   Basic knowledge of HTML, CSS and JavaScript

* 浏览器 Chrome 47 及以上版本
* [Chrome扩展应用 - Web Server](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) , 或者也可以自己搭建Web服务器。
* 示例代码(sample code)
* 文本编辑器/IDE
* HTML,CSS和JavaScript相关的基础知识

