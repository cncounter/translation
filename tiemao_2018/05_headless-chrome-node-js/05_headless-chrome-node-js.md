# NodeJS调用HeadLess-Chrome

HeadLess就是无界面的意思。

###  安装 Chrome

要求最新版, 至少是 Chrome60+。



### 1. 安装NodeJS

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


NodeJS安装完成后, 自动安装了 node, npm 等工具。

其中, node 是一个 REPL 环境, 可以执行各种JS脚本, 示例如下所示:

![](03_node_usage.jpg)

npm 全称就是 node package manage,是软件包管理工具.

如果某些安装包被墙,则可以配置代理, 或者使用淘宝的npm注册中心:

```
npm config set registry "https://registry.npm.taobao.org" 
```



### 2. 安装依赖
 
在工作目录下, 创建 headless 项目, 初始化, 并安装依赖:

```
mkdir headless
cd headless
npm init -y
npm install chrome-remote-interface --save
npm install chrome-launcher --save
```

### 执行JS交互

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

当然, 这里的演示很简单。 实际上可以执行各种操作, 比如, 用JS模拟点击某个链接, 填写并提交表单, 执行Ajax, 以及各种交互。

而且支持配置, 可以写到 JSON 配置文件里, 然后在Node脚本中调用。

还可以通过 Mocha 等测试平台进行校验, 判断是否达到UI或者UX的需求。



### 页面截图(Screenshot)


页面截图可以使用 Page 对象的 captureScreenshot 函数来执行:

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


总结

Chrome 的 headless 模式可用于自动化测试，尽管还有一些不完善的地方。
但毕竟是真实的浏览器, 比起其他测试套具来说具有很多优势。









参考: <https://www.sitepoint.com/headless-chrome-node-js/>


其他参考:

- <http://phantomjs.org/>
- <http://casperjs.org/>
- <https://developers.google.com/web/updates/2017/04/headless-chrome>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- <https://www.sitepoint.com/simplifying-asynchronous-coding-async-functions/>


