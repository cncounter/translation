# NodeJS调用HeadLess-Chrome

`Headless` 是指没有图形化界面(GUI),运行在后台的程序。

本文先简要介绍命令行模式如何调用Chrome, 然后再介绍如何通过 NodeJS 来调用HeadLess-Chrome。 至于C++的API调用则不涉及。

使用 HeadLess-Chrome 的好处是: 

- 不需要显卡支持, 可以在Linux服务器环境上执行, 也就支持客户端调用。

- 还可以用于自动化测试环境。 

- 另外, 加入IP代理池拿来刷点击量/投票也是不错的选择, 如蘑菇代理: <http://www.mogumiao.com/>。




###  1. 安装 Chrome

要求最新版, 至少是 Chrome60+。 请通过搜索引擎来查询和下载。


### 2. 命令行模式简介



2.1 生成页面加载后的截图:

```
chrome --headless --screenshot=C:/cncounter_.screenshot.png  --window-size=1024,768 http://cncounter.com
```

如果有重定向, 则截图为重定向之后的网页, 因为是 loaded 之后再保存。


2.2 页面打印为PDF文件:

```
chrome --headless --print-to-pdf=C:/cncounter.pdf  http://www.cncounter.com
```

2.3 其他命令行参数:


- 自定义 user-agent: 

```
--user-agent="Renfufei.Test 02"
```


- 指定超时时间, 超过此时间未完成加载则会强制触发 DOMContentLoaded 事件。 

```
--timeout=1000
```

- 指定 repl 以执行JS脚本:

```
--repl
```

- 指定窗口大小:

```
--window-size=1280,800
```

- 打印页面到 PDF 文件:

```
--print-to-pdf=C:/xxx.pdf
```

- 截屏:

```
--screenshot=C:/xxxx.png
```

Linux 和 MacOSX系统, 基本上也是一样的用法, 除了文件路径写法不一样。

总的来说, 命令行模式的HeadLess Chrome功能太弱了, 很多配置目前基本上是不支持的, 只能期待以后的版本进行增强。

更多参数信息请查看本文末尾的链接。



### 3. 安装NodeJS

然后安装 NodeJS。NodeJS中文网站是: <http://nodejs.cn/>, 简介如下:

> * Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 
> * Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 
> * Node.js 的包管理器 npm，是全球最大的开源库生态系统。

下载地址: <http://nodejs.cn/download/>

NodeJS下载界面如下所示:

![](02_nodejs_download.jpg)


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

其中, node 是一个 REPL 环境, 可以执行各种JS脚本, 示例如下。

```
C:\Users\Administrator>node
> Math.pow(2, 8)
256
> console.log(':'+new Date().getTime())
:1517903686795
undefined
> .exit

C:\Users\Administrator>
```

npm 全称就是 node package manage, 即Node的软件包管理工具.

如果某些安装包被墙,则可以配置代理, 或者使用淘宝的npm注册中心:

```
npm config set registry "https://registry.npm.taobao.org" 
```




### 4. 安装依赖
 
在工作目录下, 创建 headless 项目, 初始化, 并安装依赖:

```
mkdir headless
cd headless
npm init -y
npm install chrome-remote-interface --save
npm install chrome-launcher --save
```

### 5. 执行JS脚本

`chrome-launcher` 这个 NPM module 能自动查找到机器上安装的 Chrome 程序, 并启动 debug 实例, 加载浏览器, 以及关闭浏览器。当然, 因为基于Node,所以支持跨平台使用!

`chrome-remote-interface` 是一个底层API, 比 Puppeteer's API 更底层. 比起直接使用 DevTools protocol 来说, 此API更加方便.


然后,  创建 `index.js` 文件, 并输入内容:

```
// 引入依赖
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

// 自动执行的函数调用
(async function() {
    async function launchChrome() {
      return await chromeLauncher.launch({
        chromeFlags: [
          '--disable-gpu',  // 禁用GPU加速
          '--headless'
        ]
      });
    }

    // async/await - 等待异步执行结果(promise)
    const chrome = await launchChrome();
    const protocol = await CDP({
      port: chrome.port
    });

    // ALL FOLLOWING CODE SNIPPETS HERE

    const {
        DOM,
        Page,
        Emulation,
        Runtime
    } = protocol;
    // 等待以下条件全部达成
    await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

    // Page 对象可用于各种操作
    // 访问页面
    Page.navigate({
      url: 'http://blog.csdn.net/column/details/14851.html'
    });
    // 页面加载完成
    Page.loadEventFired(async() => {
        // JS代码
        const script1 = "document.querySelector('.detail_list').querySelector('h4').textContent"
        // 执行JS代码; 等待异步执行结果;
        const result = await Runtime.evaluate({
          expression: script1
        });
	// 打印返回结果
        console.log(result.result.value);

        protocol.close();
        chrome.kill(); 
    });

// end
})();

```


执行脚本 `index.js`:

```
node index.js
```

执行结果可能如下所示:

```
E:\CODE_ALL\04_Demo_ALL\headless>node index.js
1. 垃圾收集简介 - GC参考手册

```


当然, 这里的演示很简单。 实际上可以执行各种操作, 比如, 用JS模拟点击某个链接, 填写并提交表单, 执行Ajax, 以及其他交互。

而且支持配置, 可以将配置写到 JSON 文件里, 然后在Node脚本中使用。

还可以通过 Mocha 等测试平台进行校验, 判断是否达到UI或者UX的需求。



### 6. 页面截图(Screenshot)


页面截图可以使用 Page 对象的 `captureScreenshot` 函数来执行:

创建 `screenshot.js` 文件:

```
// 引入依赖
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const file = require('fs');

// 自动执行的函数调用
(async function() {
    async function launchChrome() {
      return await chromeLauncher.launch({
        chromeFlags: [
          '--disable-gpu',  // 禁用GPU加速
          '--headless'
        ]
      });
    }

    // async/await - 等待异步执行结果(promise)
    const chrome = await launchChrome();
    const protocol = await CDP({
      port: chrome.port
    });

    // ALL FOLLOWING CODE SNIPPETS HERE

    const {
        DOM,
        Page,
        Emulation,
        Runtime
    } = protocol;
    // 等待以下条件全部达成
    await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

    // Page 对象可用于各种操作
    // 访问页面
    Page.navigate({
      url: 'http://blog.csdn.net/column/details/14851.html'
    });

    // 页面加载完成之后
    Page.loadEventFired(async() => {
      // 截图
      const ss = await Page.captureScreenshot({format: 'png', fromSurface: true});
      // 保存
      file.writeFile('screenshot.png', ss.data, 'base64', function(err) {
        if (err) {
          console.log(err);
        }
      });

      protocol.close();
      chrome.kill();
    });
})();

```

执行脚本:

```
node screenshot.js
```

结果是在当前目录下写入一个图片文件:

![](03_screenshot.png)

看起来有点丑, 因为没有指定各种参数。


### 7. 调用PDF打印





### 总结

Chrome 的 headless 模式可用于自动化测试，尽管还有一些不完善的地方。
但毕竟是真实的浏览器, 比起其他测试套具来说具有很多优势。









参考: <https://www.sitepoint.com/headless-chrome-node-js/>


其他链接:


1. [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

1. [Chrome-Headless模式shell命令行参数1](https://cs.chromium.org/chromium/src/headless/app/headless_shell.cc)

1. [Chrome-Headless模式shell命令行开关](https://cs.chromium.org/chromium/src/headless/app/headless_shell_switches.cc)

1. [DIV.IO中文文章: Chrome Headless 模式  ](https://div.io/topic/1978)

1. [Headless Chromium README.md](https://chromium.googlesource.com/chromium/src/+/master/headless/README.md)

1. [Chrome DevTools Protocol ](https://chromedevtools.github.io/devtools-protocol/)

1. [Automated testing with Headless Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai)

1. [phantomjs官网](http://phantomjs.org/)

1. [casperjs官网](http://casperjs.org/)

1. [MDN: async function 简介](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

1. [sitepoint 文章: Async Function 实战](https://www.sitepoint.com/simplifying-asynchronous-coding-async-functions/)


