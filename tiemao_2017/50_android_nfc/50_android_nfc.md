
# Near Field Communication

# Android NFC-近场通信

Near Field Communication (NFC) is a set of short-range wireless technologies, typically requiring a distance of 4cm or less to initiate a connection. NFC allows you to share small payloads of data between an NFC tag and an Android-powered device, or between two Android-powered devices.

近场通信(NFC, Near Field Communication)是一种短距离的无线通讯技术, 通常是在小于4厘米的距离内发起连接. NFC标签与Android设备之间可以通过NFC技术交换少量的数据, 当然两个Android设备之间也是可以的。

Tags can range in complexity. Simple tags offer just read and write semantics, sometimes with one-time-programmable areas to make the card read-only. More complex tags offer math operations, and have cryptographic hardware to authenticate access to a sector. The most sophisticated tags contain operating environments, allowing complex interactions with code executing on the tag. The data stored in the tag can also be written in a variety of formats, but many of the Android framework APIs are based around a [NFC Forum](http://www.nfc-forum.org/) standard called NDEF (NFC Data Exchange Format).

标签的复杂度各不相同。简单标签只提供读/写语义, 有时带有一次性可编程(one-time-programmable)区域, 使卡片变为只读。更复杂的标签提供数学运算, 并带有加密硬件来验证对某个扇区(sector)的访问。最复杂的标签包含运行环境, 允许在标签上执行的代码进行复杂的交互。标签中存储的数据也可以用各种格式写入, 但许多 Android 框架 API 都基于一个名为 NDEF(NFC Data Exchange Format, NFC 数据交换格式)的 [NFC Forum](http://www.nfc-forum.org/) 标准。

Android-powered devices with NFC simultaneously support three main modes of operation:

搭载 NFC 的 Android 设备同时支持三种主要的操作模式:

1. **Reader/writer mode**, allowing the NFC device to read and/or write passive NFC tags and stickers.

1. **Reader/writer mode**, 读/写模式, 允许NFC设备读取 和/或 写入 被动NFC卡片/贴纸(tags/stickers)。

2. **P2P mode**, allowing the NFC device to exchange data with other NFC peers; this operation mode is used by Android Beam.

2. **P2P mode**, P2P模式, 允许NFC设备与其他NFC节点交换数据; 这个操作模式主要是 Android Beam 在使用。

3. **Card emulation mode**, allowing the NFC device itself to act as an NFC card. The emulated NFC card can then be accessed by an external NFC reader, such as an NFC point-of-sale terminal.

3. **Card emulation mode**, 模拟NFC卡模式, 允许Android设备将自身模拟为一张NFC卡。模拟成为NFC卡之后, 可以被外部NFC读卡器读取, 例如NFC销售终端(POS机)。


- [**NFC Basics**](https://developer.android.com/guide/topics/connectivity/nfc/nfc.html)

  This document describes how Android handles discovered NFC tags and how it notifies applications of data that is relevant to the application. It also goes over how to work with the NDEF data in your applications and gives an overview of the framework APIs that support the basic NFC feature set of Android.


  本文档描述了 Android 如何处理发现到的 NFC 标签, 以及它如何把与应用相关的数据通知给应用。同时介绍了如何在应用中使用 NDEF 数据, 并概述了支持 Android 基本 NFC 功能集的框架 API。

- [**Advanced NFC**](https://developer.android.com/guide/topics/connectivity/nfc/advanced-nfc.html)

  This document goes over the APIs that enable use of the various tag technologies that Android supports. When you are not working with NDEF data, or when you are working with NDEF data that Android cannot fully understand, you have to manually read or write to the tag in raw bytes using your own protocol stack. In these cases, Android provides support to detect certain tag technologies and to open communication with the tag using your own protocol stack.


  本文档介绍了用于使用 Android 所支持的各种标签技术的 API。当你不处理 NDEF 数据时, 或者当 Android 无法完全理解你正在处理的 NDEF 数据时, 你必须使用自己的协议栈, 以原始字节的形式手动读写标签。在这些情况下, Android 提供了支持, 用于检测某些标签技术, 并使用你自己的协议栈与标签建立通信。

- [**Host-based Card Emulation**](https://developer.android.com/guide/topics/connectivity/nfc/hce.html)

  This document describes how Android devices can perform as NFC cards without using a secure element, allowing any Android application to emulate a card and talk directly to the NFC reader.

  本文档描述了 Android 设备如何在不使用安全元件(secure element)的情况下充当 NFC 卡, 从而允许任何 Android 应用模拟卡片, 并直接与 NFC 读卡器通信。

<https://developer.android.com/guide/topics/connectivity/nfc/index.html>

