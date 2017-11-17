
# Near Field Communication

# 近场通信

Near Field Communication (NFC) is a set of short-range wireless technologies, typically requiring a distance of 4cm or less to initiate a connection. NFC allows you to share small payloads of data between an NFC tag and an Android-powered device, or between two Android-powered devices.

近场通信(NFC)是一组的短距离无线技术,通常要求4厘米左右的距离发起连接.NFC允许你分享小载荷之间的数据一个NFC标签和一个android设备,或两个android设备之间。

Tags can range in complexity. Simple tags offer just read and write semantics, sometimes with one-time-programmable areas to make the card read-only. More complex tags offer math operations, and have cryptographic hardware to authenticate access to a sector. The most sophisticated tags contain operating environments, allowing complex interactions with code executing on the tag. The data stored in the tag can also be written in a variety of formats, but many of the Android framework APIs are based around a [NFC Forum](http://www.nfc-forum.org/) standard called NDEF (NFC Data Exchange Format).

标签可以在复杂性范围。简单标记提供读写语义,有时one-time-programmable地区卡只读.更复杂的标签提供数学操作,加密硬件验证访问部门.最复杂的标签包含操作环境,允许复杂的交互代码执行标签上.标签中存储的数据也可以用不同的格式,但是许多Android框架api是基于NFC论坛(http://www.nfc-forum.org/)标准称为NDEF(NFC数据交换格式)。

Android-powered devices with NFC simultaneously support three main modes of operation:

安卓设备NFC同时支持三个主要模式操作:

1. **Reader/writer mode**, allowing the NFC device to read and/or write passive NFC tags and stickers.

1. * * * *读/写模式,允许NFC设备读和/或写被动NFC标签和贴纸。

2. **P2P mode**, allowing the NFC device to exchange data with other NFC peers; this operation mode is used by Android Beam.

2. * * * * P2P模式,允许NFC设备与其他NFC同行交换数据;这个操作模式使用Android梁。

3. **Card emulation mode**, allowing the NFC device itself to act as an NFC card. The emulated NFC card can then be accessed by an external NFC reader, such as an NFC point-of-sale terminal.

3. * * * *卡模拟模式,允许NFC设备本身作为一个NFC卡。模拟NFC卡可以访问外部NFC读者,比如一个NFC销售点终端。


- [**NFC Basics**](https://developer.android.com/guide/topics/connectivity/nfc/nfc.html)

- (* * NFC基本* *)(https://developer.android.com/guide/topics/connectivity/nfc/nfc.html)

  This document describes how Android handles discovered NFC tags and how it notifies applications of data that is relevant to the application. It also goes over how to work with the NDEF data in your applications and gives an overview of the framework APIs that support the basic NFC feature set of Android.


本文档描述了Android如何处理发现的NFC标签以及它如何通知应用程序与应用程序相关的数据.也会在如何使用NDEF数据在您的应用程序和框架api的概述支持Android的基本NFC功能集。

- [**Advanced NFC**](https://developer.android.com/guide/topics/connectivity/nfc/advanced-nfc.html)

- (* *先进的NFC * *)(https://developer.android.com/guide/topics/connectivity/nfc/advanced-nfc.html)

  This document goes over the APIs that enable use of the various tag technologies that Android supports. When you are not working with NDEF data, or when you are working with NDEF data that Android cannot fully understand, you have to manually read or write to the tag in raw bytes using your own protocol stack. In these cases, Android provides support to detect certain tag technologies and to open communication with the tag using your own protocol stack.


这个文档的api支持使用Android支持各种标记技术.当你不处理NDEF数据时,或者当你正在与Android NDEF数据不能完全理解,你必须手动读或写在原始字节标签使用自己的协议栈.在这些情况下,Android提供支持来检测某些标记技术和开放与标签通信使用自己的协议栈。

- [**Host-based Card Emulation**](https://developer.android.com/guide/topics/connectivity/nfc/hce.html)

- (* *基于主机卡模拟* *)(https://developer.android.com/guide/topics/connectivity/nfc/hce.html)

  This document describes how Android devices can perform as NFC cards without using a secure element, allowing any Android application to emulate a card and talk directly to the NFC reader.




本文档描述了Android设备可以执行NFC卡片不使用一个安全的元素,允许任何Android应用程序模拟一个卡和NFC读者直接对话。

<https://developer.android.com/guide/topics/connectivity/nfc/index.html>

