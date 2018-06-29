## 3. Get the sample code

## 3. 获取示例代码

## Download the code

## 下载代码

If you're familiar with git, you can download the code for this codelab from GitHub by cloning it:

如果你熟悉git工具, 可以直接使用下面的脚本,从GitHub克隆代码:

```
git clone https://github.com/googlecodelabs/webrtc-web
```



Alternatively, click the following button to download a .zip file of the code:

如果不熟悉GIT, 可以通过下面的链接下载 zip 压缩包:

[Download source code](https://github.com/googlecodelabs/webrtc-web/archive/master.zip)

> 如果下载失败或者网络缓慢, 可以通过小工具页面下载: <http://www.cncounter.com/tools/download.php?targetfilename=random.zip&origfileurl=https%3A%2F%2Fgithub.com%2Fgooglecodelabs%2Fwebrtc-web%2Farchive%2Fmaster.zip>


Open the downloaded zip file. This will unpack a project folder (**adaptive-web-media**) that contains one folder for each step of this codelab, along with all of the resources you will need.

打开下载的zip文件。这将打开一个项目文件夹(* * adaptive-web-media * *)包含一个文件夹codelab每一步,还有你需要的所有资源。

You'll be doing all your coding work in the directory named **work**.

你将会做所有的编码工作目录命名为* * * *工作。

The **step-nn** folders contain a finished version for each step of this codelab. They are there for reference.

* * step-nn * *文件夹包含本codelab每一步完成版本。他们有供参考。

## Install and verify web server

## web服务器安装和验证

While you're free to use your own web server, this codelab is designed to work well with the Chrome Web Server. If you don't have that app installed yet, you can install it from the Chrome Web Store.

当你可以自由地使用自己的web服务器,这codelab设计工作与Chrome web服务器。如果你还没有应用程序安装,您可以安装Chrome Web Store。

[Install Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/6ddeb4aee53c0f0e.png)



After installing the **Web Server for Chrome** app, click on the Chrome Apps shortcut from the bookmarks bar, a New Tab page, or from the App Launcher:

在安装Chrome * *的* * Web服务器应用程序,点击书签栏的Chrome应用程序快捷方式,一个新的标签页,或者从应用程序启动器:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/bab91398f0bf59f5.png)



Click on the Web Server icon:

单击Web服务器图标:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/60da10ee57cbb190.png)



Next, you'll see this dialog, which allows you to configure your local web server:

接下来,您将看到这个对话框,它允许您配置您的本地web服务器:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/433870360ad308d4.png)



Click the **CHOOSE FOLDER** button, and select the **work** folder you just created. This will enable you to view your work in progress in Chrome via the URL highlighted in the Web Server dialog in the **Web Server URL(s)** section.

点击* * * *选择文件夹按钮,并选择您刚才创建的* * * *工作文件夹.这将使您能够查看您的工作进展铬通过Web服务器对话框中突出显示的URL(s)* * * * Web服务器URL部分。

Under **Options**, check the box next to **Automatically show index.html** as shown below:

在* * * *,* *旁边的复选框自动显示指数。html * *如下所示:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/8937a38abc57e3.png)



Then stop and restart the server by sliding the toggle labeled **Web Server: STARTED** to the left and then back to the right.

然后停止并重新启动服务器通过滑动切换标签* * Web服务器:向左开始* *,然后回到正确的。

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/daefd30e8a290df5.png)



Now visit your work site in your web browser by clicking on the highlighted Web Server URL. You should see a page that looks like this, which corresponds to **work/index.html**:

现在在您的web浏览器中访问你的工作网站点击高亮显示的web服务器URL。您应该看到一个这样的页面,这对应于* *工作/ index . html * *:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/a803d28bc7109d5c.png)



Obviously, this app is not yet doing anything interesting — so far, it's just a minimal skeleton we're using to make sure your web server is working properly. You'll add functionality and layout features in subsequent steps.

显然,这个程序还没有做任何有趣的——到目前为止,这只是一个最小的骨架我们使用,以确保您的web服务器工作正常.你将在随后的步骤中添加功能和布局功能。

From this point forward, all testing and verification should be performed using this web server setup. You'll usually be able to get away with simply refreshing your test browser tab.

从这一刻起,所有的测试和验证应该执行使用这个web服务器设置。你通常可以侥幸只刷新您的测试浏览器选项卡。

