# 2. Overview

# 2. WebRTC 课程概述

Build an app to get video and take snapshots with your webcam and share them peer-to-peer via WebRTC. Along the way you'll learn how to use the core WebRTC APIs and set up a messaging server using Node.js.

本文将会逐步介绍如何构建一款 WebRTC 应用, 利用网络摄像头(webcam) 拍照、录像、以及通过 peer-to-peer 网络共享相关信息. 在此过程中, 我们将学习如何使用WebRTC的核心 API, 还将介绍如何使用 Node.js 来搭建消息服务器。

## What you'll learn

## 我们会学习以下知识点

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

## 环境准备

*   Chrome 47 or above
*   [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb), or use your own web server of choice.
*   The sample code
*   A text editor
*   Basic knowledge of HTML, CSS and JavaScript

* Chrome 47及以上的版本
* [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) , 或者使用你自己的Web服务器。
* 示例代码(sample code)
* 文本编辑器/IDE
* 基本的HTML,CSS和JavaScript知识

