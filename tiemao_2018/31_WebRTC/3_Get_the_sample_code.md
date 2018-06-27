## 3. Get the sample code

## Download the code

If you're familiar with git, you can download the code for this codelab from GitHub by cloning it:

```
git clone https://github.com/googlecodelabs/webrtc-web
```

Alternatively, click the following button to download a .zip file of the code:

[Download source code](https://github.com/googlecodelabs/webrtc-web/archive/master.zip)

Open the downloaded zip file. This will unpack a project folder (**adaptive-web-media**) that contains one folder for each step of this codelab, along with all of the resources you will need.

You'll be doing all your coding work in the directory named **work**.

The **step-nn** folders contain a finished version for each step of this codelab. They are there for reference.

## Install and verify web server

While you're free to use your own web server, this codelab is designed to work well with the Chrome Web Server. If you don't have that app installed yet, you can install it from the Chrome Web Store.

[Install Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/6ddeb4aee53c0f0e.png)

After installing the **Web Server for Chrome** app, click on the Chrome Apps shortcut from the bookmarks bar, a New Tab page, or from the App Launcher:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/bab91398f0bf59f5.png)

Click on the Web Server icon:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/60da10ee57cbb190.png)

Next, you'll see this dialog, which allows you to configure your local web server:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/433870360ad308d4.png)

Click the **CHOOSE FOLDER** button, and select the **work** folder you just created. This will enable you to view your work in progress in Chrome via the URL highlighted in the Web Server dialog in the **Web Server URL(s)** section.

Under **Options**, check the box next to **Automatically show index.html** as shown below:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/8937a38abc57e3.png)

Then stop and restart the server by sliding the toggle labeled **Web Server: STARTED** to the left and then back to the right.

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/daefd30e8a290df5.png)

Now visit your work site in your web browser by clicking on the highlighted Web Server URL. You should see a page that looks like this, which corresponds to **work/index.html**:

![](https://codelabs.developers.google.com/codelabs/webrtc-web/img/a803d28bc7109d5c.png)

Obviously, this app is not yet doing anything interesting — so far, it's just a minimal skeleton we're using to make sure your web server is working properly. You'll add functionality and layout features in subsequent steps.

From this point forward, all testing and verification should be performed using this web server setup. You'll usually be able to get away with simply refreshing your test browser tab.

