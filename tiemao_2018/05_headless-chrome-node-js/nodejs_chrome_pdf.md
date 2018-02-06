# NodeJS调用Chrome打印PDF

`Headless` 是指没有图形化界面(GUI),运行在后台的程序。

本文简要介绍如何通过 NodeJS 来调用HeadLess-Chrome。 

使用 HeadLess-Chrome 的好处是: 

- 不需要显卡支持, 可以在Linux服务器环境上运行。

- 还可以用于自动化测试环境。 


###  1. 安装 Chrome(可省略...)

要求最新版, 至少是 Chrome60+。 请通过搜索引擎来查询和下载。


### 2. 安装NodeJS

然后安装 NodeJS。NodeJS中文网站是: <http://nodejs.cn/>, 简介如下:

> * Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 
> * Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 
> * Node.js 的包管理器 npm，是全球最大的开源库生态系统。

下载地址: <http://nodejs.cn/download/>

建议下载最新版本,如 NodeJS v8.1.3+ 等。

安装到默认目录,完成后查看版本号: `node -v`

示例:

```
node -v
v8.1.3

npm -v
5.0.3
```


NodeJS安装完成后, 自动安装了 node环境, 以及 npm 等工具。

其中, node 是一个 REPL 环境, 可以执行各种JS脚本.

npm 全称就是 node package manage, 即Node的软件包管理工具.

如果某些安装包被墙,则可以配置代理, 或者使用淘宝的npm注册中心:

```
npm config set registry "https://registry.npm.taobao.org" 
```


### 3. 安装 Puppeteer

Puppeteer是一个上层API,封装了大部分操作, 内置Chrome, 使用非常简单简洁:



#### 使用 npm 安装

因为墙的原因, 需要使用淘宝镜像安装 puppeteer:

```
mkdir -p puppeteerdemo
cd puppeteerdemo

npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
npm i puppeteer

```

#### 或者用淘宝的 cnpm 安装，自动使用国内源:

```
mkdir -p puppeteerdemo
cd puppeteerdemo
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm i puppeteer
```

还不行就自己使用代理。



### 4. puppeteer 打印PDF

在 puppeteerdemo 文件夹下创建 puppeteer.js 文件:

```
// 加载依赖库
const puppeteer = require('puppeteer');

(async () => {
  // 创建浏览器实例, 等待Promise返回
  const browser = await puppeteer.launch();
  // 打开新标签页
  const page = await browser.newPage();
  // 打开页面
  await page.goto('http://exam.yiboshi.com/manage/login');
  // 截屏
  await page.screenshot({path: 'exam_login.png'});
  // 打印PDF
  await page.pdf({
    path: 'exam_login_p.pdf'
  });

  // 执行完成之后, 关闭浏览器
  await browser.close();
})();
```

然后在命令行执行:

```
node puppeteer.js
```

具体的配置项请参考: <puppeteer.js> 文件。


puppeteer相关的API和配置项请参考: <https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md>









参考: <https://www.sitepoint.com/headless-chrome-node-js/>


其他链接:


1. [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

2. [Chrome-Headless模式shell命令行参数1](https://cs.chromium.org/chromium/src/headless/app/headless_shell.cc)

3. [Chrome-Headless模式shell命令行开关](https://cs.chromium.org/chromium/src/headless/app/headless_shell_switches.cc)

4. [DIV.IO中文文章: Chrome Headless 模式  ](https://div.io/topic/1978)

5. [Headless Chromium README.md](https://chromium.googlesource.com/chromium/src/+/master/headless/README.md)

6. [Chrome DevTools Protocol ](https://chromedevtools.github.io/devtools-protocol/)

7. [Automated testing with Headless Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai)

8. [phantomjs官网](http://phantomjs.org/)

9. [casperjs官网](http://casperjs.org/)

10. [Puppeteer API](https://developers.google.com/web/tools/puppeteer/)

11. [MDN: async function 简介](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

12. [sitepoint 文章: Async Function 实战](https://www.sitepoint.com/simplifying-asynchronous-coding-async-functions/)


