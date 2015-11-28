# Android Studio 生成签名的APK


打开项目以后,点击项目，选择 **Build** 菜单, 然后选择 **Generate Signed APK**. 如下图所示:

![](01_menu.png)


打开生成对话框：

![](02_generate_dialog.png)

选择 **Create new...** 按钮, 生成新的Key, 弹出新生成对话框:

![](03_new_key_store.png)

首先选择 Key 存储的路径. 

![](04_key_store.png)

可能是有BUG, 在弹出的选择 keystore file 对话框中，需要先输入 File name, 如 ``, 文件后缀名 保持默认的 jks 不变。然后再改变保存的路径(否则输入不了名字).

最后的路径可能是这样的: `E:\CODE_ALL\02_GIT_ALL\cncounter-android\key_store\cncounter-android-key.jks`

接着输入密码, 建议不要太简单,也不要太复杂。 此处示例的密码为: 

	cncounter-android

为了简单起见， 所有密码都设置为同一个：

	cncounter-android

有效时间默认25年，以支撑你的整个APP周期。

Country Code (XX) 应该是 **CN**, 如下图所示: 

![](05_cncounter-android.png)

然后点击**OK**, 回到生成界面。

![](06_generate_cnc.png)

勾选上记住密码，然后点击下一步.

如果弹出输入密码保护,可以选择留空,不使用这种保护。

![](07_leave_empty.png)

点击OK，进入下一步:

![](08_release_dist.png)

选择 **release** 是发布版本，选择 debug 是调试版本。 此处, 选择 **release** , 然后点击完成按钮即可。

然后会告诉你生成完毕，可以选择查看:

![](08_02_ok.png)

生成的aPK如下所示:

![](10_explorer.png)

下次需要生成，只需要从  **Build** 菜单, 选择 **Generate Signed APK** 即可。 如下图所示:

![](09_generate_apk.png)

因为上次选择了记住密码，所以这里不需要记住密码。

然后继续即可。


官方链接:[http://developer.android.com/intl/zh-cn/tools/publishing/app-signing.html](http://developer.android.com/intl/zh-cn/tools/publishing/app-signing.html)


日期: 2015年11月28日

作者: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

