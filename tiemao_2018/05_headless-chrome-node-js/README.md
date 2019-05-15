# 用Chrome将网页打印成PDF

本文通过示例，演示怎样使用 HeadLess-Chrome 将网页打印保存为PDF文件, 并在此基础上，进行适当的扩展与集成,来提供自动化的服务。

最新版的Chrome为程序员提供了很多实用的功能, Chrome60版本开始支持Headless模式。

Headless Chrome也称为无头浏览器, `Headless` 模式指没有图形交互界面(GUI)。

Chrome支持多种方式的调用与交互,常用的有:

- 命令行方式; 可以进行简单的试验和使用,但比较简陋，不支持复杂的配置参数。
- NodeJS调用; 谷歌官方提供了 Puppeteer 库,内置了Chrome, 非常强大和方便。
- C++方式; 把Chrome当做一个第三方库, 详情请参考本文官网文档。 


使用HeadLess模式的好处: 

- 不需要显卡支持, 可以在Linux服务器以及Windows环境上运行。

- 用于自动化测试、可以触发自定义操作，执行JS脚本，模拟真实环境应对各种复杂情况。 

- 加入IP代理池, 拿来刷点击量/投票，能破解大部分高级预防措施，算是不错的选择。好用的IP池，比如蘑菇代理: <http://www.moguproxy.com/>。

将网页保存为PDF进行存档的好处，是因为修改网页和样式非常简单，应对需求变更的能力非常棒。 比起硬编码将数据转换为PDF，实现起来，以及修改起来都容易很多。

下面，一起来看如何实现。

## 1、命令行方式

###  1.1 安装 Chrome

> 安装Chrome之后则可以使用命令行方式调用。 如果对命令行方式不感兴趣，可跳过这一步。

官网地址为: <https://www.google.com/chrome/>

下载并安装最新版的Chrome, 至少Chrome60+。可以搜索 [离线安装 Chrome] 找到下载地址。

安转成功后一般会自动打开浏览器。

Chrome本身就可以将网页打印为PDF文件，一般是按 `CTRL+P` 调出打印界面,选择目标是另存为PDF，此外还可以控制纸张、页眉、背景等选项。


### 1.2 页面打印为PDF文件:

执行如下命令:

```
chrome --headless --print-to-pdf=C:/renfufei_blog.pdf  https://renfufei.blog.csdn.net/

```

如果不报错，命令会立即返回。稍后会在指定位置保存对应的文件: `C:/renfufei_blog.pdf`; 可以自己打开试试。

如果页面有重定向, 则保存的文件为重定向后的网页界面, 因为是 DOMContentLoaded 事件触发之后才会执行保存操作。

如果提示 ['chrome' 不是内部或外部命令，也不是可运行的程序或批处理文件。], 则可能是找不到本地安装的 chrome, 需要配置PATH环境变量, 或者设置 alias。请参考本文末尾的相关链接。

更多命令行相关的功能、参数和选项，请参考: <https://developers.google.com/web/updates/2017/04/headless-chrome>




### 2、NodeJS方式调用

#### 2.1 安装NodeJS

然后安装 NodeJS。NodeJS中文网站是: <http://nodejs.cn/>, 简介如下:

> * Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 
> * Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 
> * Node.js 的包管理器 npm，是全球最大的开源库生态系统。

下载地址: <http://nodejs.cn/download/>

建议下载最新版本,如 NodeJS v10+ 等。

安装到默认目录,完成后查看版本号: `node -v`

示例:

```
node -v
v8.1.3

npm -v
5.0.3
```


NodeJS安装完成后, 自动安装了 node、npm 等工具。

其中, node 是一个 REPL 环境, 可以执行各种JS脚本.

npm 全称就是 node package manage, 即Node的软件包管理工具.

如果某些安装包下载速度缓慢, 则可以先安装淘宝提供的 `cnpm` 程序, cnpm的使用方式和npm基本上完全一致。:

```
npm install -g cnpm --registry=https://registry.npm.taobao.org

```


安装完成后, 使用命令 `cnpm -v` 查看版本:

```
C:\Users\Administrator>cnpm -v
cnpm@6.0.0 
......省略部分
registry=https://registry.npm.taobao.org
```

#### 2.2 安装 Puppeteer

> puppeteer, 音[,pʌpɪ'tɪr]; 类似: 帕皮提尔; 意思是 `操纵,傀儡师`;

Puppeteer是一个上层API, 封装了几乎所有可用的操作, 内置了Chrome, 使用起来非常方便。

 
在工作目录下, 创建 puppeteer的demo项目, 初始化, 并安装依赖:

windows命令行下切换盘符:

```
C:\Users\Administrator>e:
E:\>
```

然后创建目录, 当然也可以通过鼠标创建。

```
mkdir pptrdemo1
```

接着执行项目初始化

```
cd pptrdemo1

cnpm init -y
```

初始化会生成一个nodejs项目，主要是生成 `package.json` 文件.


然后安装`puppeteer`依赖:

```
cnpm i puppeteer --save
```

这里, `cnpm i` 等价于 `cnpm install`, 算是简写。

其中 `--save` 的意思,则是指定将依赖信息写入到 `package.json` 文件中;

安装过程中,大约需要下载100多MB的文件, 请耐心等待。

如果出错, 可能需要使用代理, 请到社区咨询或者搜索相关错误信息。


#### 2.3. 用puppeteer将网页打印成PDF

在工作目录下创建文件 `demo-printpdf.js`, 内容为:

```
// 加载依赖库;需要前面的步骤先安装好;
const puppeteer = require('puppeteer');

(async () => {
  // 创建浏览器实例; await是同步等待完成的意思;
  const browser = await puppeteer.launch();
  // 打开新标签页
  const page = await browser.newPage();
  // 打开页面
  await page.goto('https://renfufei.blog.csdn.net/');
  // 配置参数
  var pdf_option = {
          // 保存路径, 可以为绝对路径
          path: 'renfufei_blog.pdf', 
          // 是否显示页眉页脚, 默认 false
          displayHeaderFooter : false,
          // 打印背景图片, 默认 false
          printBackground : true,
          // 水平方向, 默认 false
          //landscape : true,
          // 纸张尺寸, 默认 'Letter', 如:
          // Letter:Legal:Tabloid:Ledger:或:
          // A0:A1:A2:A3:A4:A5:A6:
          format : 'A4', 
          // 页边距
          margin : {
              top    : '10px',
              right  : '10px',
              bottom : '10px',
              left   : '10px',
          }
      };
  // 可以模拟媒介样式为 screen, 默认则是打印模式 'print' 
  await page.emulateMedia('screen');
  // 打印PDF
  await page.pdf(pdf_option);

  // 执行完成后, 关闭浏览器实例
  await browser.close();
})();

```

然后在当前目录, 通过命令行使用nodejs执行该脚本:

```
node demo-printpdf.js
```

稍等片刻, 执行完成后, 即可在指定路径下看到 `renfufei_blog.pdf` 文件, 打开试试?

puppeteer相关的API和配置项请参考: <https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md>


#### 2.4 解决Linux乱码问题

要将HTML中的文字展示出来, 系统需要安装有相应的字体文件, 否则, 只能展示为问号字符 "?" 。

显示图片，以及保存PDF都需要字体文件的支持。


Linux 中文乱码问题, 请参考: <http://182.92.149.152/python/article_96.html>

首先将Windows下对应的字体文件, 复制到Linux的某个目录中, 然后才能安装。

> 控制面板\外观和个性化\字体; CTRL+A全选， CTRL+C复制到另一个目录，然后想办法上传。


```

# 请保证该文件夹下面已经有了字体文件.
# 进入字体存放目录
cd /usr/share/fonts/windows

mkfontscale

mkfontdir

fc-cache -fv

source /etc/profile

```

如果是 CentOS7.2/7.3的依赖库问题, 请参考: <https://segmentfault.com/a/1190000011382062>

比如执行:

```
sudo yum -y install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64
```

以及更新 nss 库:

```
sudo yum -y update nss
```



### 3. 集成http与puppeteer提供打印服务

NodeJS 通过内置的 http/https 模块来提供web服务。

#### 3.1 基本的http示例

创建 `demo-http.js` 文件

```
// 模块以及端口号
const http = require('http');
const http_port = 3000;

// 请求处理器
const requestHandler = (request, response) => {
  console.log("request.url="+request.url);
  response.end('Hello Node.js Server!');
};

// 创建http-server实例
const server = http.createServer(requestHandler);
// 启动监听
server.listen(http_port, function(err){
  if (err) {
    return console.error('something bad happened', err);
  }
  console.log('server is listening on: ' + http_port);
});

```

启动服务器:

```
node demo-http.js
```

然后用浏览器打开页面试试: <http://localhost:3000/>

如果要关闭正在命令行中执行的程序, 按 `CTRL+C` 组合键打断即可。


### 3.2 express框架示例

安装 express 框架:

```
cnpm install express --save

```

其中 `--save` 选项,指定将依赖信息写入到 `package.json` 文件中;



创建 `demo-express.js` 文件:

```
// express参考API: http://expressjs.com/en/api.html

// 模块依赖
const path = require('path');
const express = require('express');
// 端口号
const http_port = 3000;
// express服务实例
const server = express();

// 请求 Mapping
// get, post, put, all 等方法
server.get('/', function(request, response){
    // express 包装的参数
    var params = request.query;
    response.json(params);
});

// 启动监听
server.listen(http_port, function(err){
  if (err) {
    // 如果启动时发生错误:
    return console.error('something bad happened', err);
  }
  console.log('server is listening on: ' + http_port);
});
```

启动 express 服务器:

```
node demo-express.js
```

然后可以访问地址: <http://localhost:3000/?authorName=tiemao>

修改一下附带的参数, 看看结果有什么不同。

我们还可以设置调试模式:


```
set DEBUG=express*
node demo-express.js
```

继续访问地址: <http://localhost:3000/?authorName=tiemao>, 可以看到控制台输出了很多带颜色的日志信息。

关于nodejs与http服务,请参考: <https://blog.risingstack.com/your-first-node-js-http-server/>


#### 2.3. 集成http服务与PDF打印


先创建 `printpdf.js` 文件, 内容为:

```
// 简单的打印PDF的模块
// 本模块提供2个方法: 
//     initBrowser(); 初始化浏览器; 返回 浏览器实例 - promise
//     printpdf(config, browser);  打印PDF(配置信息, 浏览器实例)
!(function(exports){

    // 加载依赖库
    const puppeteer = require('puppeteer');

    async function initBrowser(){
      // 创建浏览器实例
      const browser = await puppeteer.launch();
      return browser;
    };

    async function printpdf(config, browser){
        //
        var browser = config.browser;
        var needCloseBrowser = false;
        //
        if(!browser){
            browser = await initBrowser();
            needCloseBrowser = true;
        }
        // 打开新标签页
        const pageTab = await browser.newPage();
        
        // 请求URL
        var url = config.url;
        // 文件保存路径
        var path = config.path;
        // 回调地址
        var callback = config.callback;
        // 打开页面
        await pageTab.goto(url);
        //
        var pdf_option = {
              // 保存路径, 可以为绝对路径
              path: path,
              // 缩放倍数, 默认 1
              //scale: 1,
              // 页眉模板
              //headerTemplate: '',
              // 页脚模板
              //footerTemplate: '',
              // 是否显示页眉页脚, 默认 false
              displayHeaderFooter : false,
              // 打印背景图片, 默认 false
              printBackground : true,
              // 水平方向, 默认 false
              //landscape : true,
              // 打印页码范围, 默认空串表示所有,格式: '1-5, 8, 11-13'
              // pageRanges : '',
              // 纸张尺寸, 默认 'Letter', 如:
              // Letter:Legal:Tabloid:Ledger:
              // A0:A1:A2:A3:A4:A5:A6:
              format : 'A4',
              // format 优先级比 width 和 height 高
              // 可以带单位,支持'px','cm','in','mm'
              //width : 800,
              //height : '600px',
              // 页边距
              margin : {
                  top    : '1cm',
                  right  : '1cm',
                  bottom : '1cm',
                  left   : '1cm',
              }
          };
      // 模拟 screen 媒介样式来打印PDF
      await pageTab.emulateMedia('screen');
      // 打印PDF
      await pageTab.pdf(pdf_option);

      // 关闭标签页
      await pageTab.close()

      // 执行完成之后, 关闭浏览器
      if(needCloseBrowser){
        await browser.close();
      }
    };

    //
    exports.initBrowser = initBrowser;
    exports.printpdf = printpdf;

// end
})(exports);
```


再创建 express-pdf.js 文件:


```
// express参考API: http://expressjs.com/en/api.html

// 模块依赖
var http = require('http');
const path = require('path');
const express = require('express');
// 端口号
const http_port = 3000;
// express服务实例
const server = express();
// 本地模块依赖
const printpdf = require('./printpdf.js');

// 请求 Mapping; get, post, put, all 等

server.get('/printpdf.json', function(request, response){
    // express 包装的参数
    var params = request.query;
    // 请求URL
    var url = params.url;
    // 文件保存路径
    var path = params.path;
    // 回调地址
    var callback = params.callback;
    //
    var startMillis = new Date().getTime();

    //
    var config = {
        url : url,
        path : path,
        callback : callback
    };
    var promise = printpdf.printpdf(config);
    //
    promise.then(function(){
        //
        var successMillis = new Date().getTime();
        var costMillis = successMillis - startMillis;
        //
        console.log("costMillis=", costMillis);
        //  加上成功标识
        // 回调通知
        callback && http.get(callback, function(resp){
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
                data = data.trim();
            });
            resp.on('end', () => {
                console.log("request:"+callback, ";statusCode=", resp.statusCode);
                console.log("data="+data);
            });
        });
    }).catch(function(err){
        //
        console.error(err);
        // ...可以加上错误消息
        // 回调通知
        callback && http.get(callback);
    });
    // 返回JSON数据
    response.json(params);
});


// 启动监听
server.listen(http_port, function(err){
  if (err) {
    // 如果启动时发生错误:
    return console.error('something bad happened', err);
  }
  console.log('server is listening on: ' + http_port);
});

```


启动服务器:

```
node express-pdf.js
```

在浏览器输入地址,加入参数访问即可查看效果:

<http://localhost/pdf.json?callback=http%3A%2F%2Fwww.cncounter.com%2Ftest%2Fcounter.jsp%3Fformat%3Djson&url=http%3A%2F%2Fwww.cncounter.com&path=E%3A%2Fcncounter_home.pdf>





### 2.4. 文件下载

创建 demo-download.js 文件:

```
// 模块依赖
const fs = require('fs');
const path = require('path');
const express = require('express');
// 端口号
const http_port = 3000;
// express服务实例
const server = express();
// 可以为绝对路径;
var storagePath = "workspace";

// 示例: http://localhost:80/download/cncounter_home.pdf
// 对应的文件为: ${storagePath}/cncounter_home.pdf
server.get('/download/:fileName', function(req, res, next) {
  // 实现文件下载 
  var fileName = req.params.fileName;
  // 文件路径
  var filePath = storagePath + "/" + fileName;
  var stats = fs.statSync(filePath); 
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename='+fileName,
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.end(404);
  }
});

// 启动监听
server.listen(http_port, function(err){
  if (err) {
    // 如果启动时发生错误:
    return console.error('something bad happened', err);
  }
  console.log(`server is listening on ${http_port}`);
});

```

启动服务器:

```
node demo-download.js
```

假设项目根目录下存在 `workspace/cncounter_home.pdf` 文件。

浏览器访问类似地址即可下载: <http://localhost:3000/download/cncounter_home.pdf>

使用 storagePath 或者类似变量的目的, 是将程序和存储分开。


更多： 压缩文件夹与目录。



### 总结

Chrome 的 headless 模式可用于自动化测试，尽管有一些不完善的地方。
毕竟是真实的浏览器, 比起其他前端自动化测试工具来说, 具有很大优势。













其他链接:

1. [Chrome官方网站](https://www.google.com/chrome/)

1. [chromium项目官网](http://www.chromium.org/)

1. [Puppeteer API](https://developers.google.com/web/tools/puppeteer/)

1. [DIV.IO中文文章: Chrome Headless 模式  ](https://div.io/topic/1978)

1. [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

1. [Chrome-Headless模式shell命令行参数1](https://cs.chromium.org/chromium/src/headless/app/headless_shell.cc)

1. [Chrome-Headless模式shell命令行开关](https://cs.chromium.org/chromium/src/headless/app/headless_shell_switches.cc)

1. [Headless Chromium README.md](https://chromium.googlesource.com/chromium/src/+/master/headless/README.md)

1. [Chrome DevTools Protocol ](https://chromedevtools.github.io/devtools-protocol/)

1. [Automated testing with Headless Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai)

1. [phantomjs官网](http://phantomjs.org/)

1. [casperjs官网](http://casperjs.org/)

1. [MDN: async function 简介](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

1. [sitepoint文章: Async Function 实战](https://www.sitepoint.com/simplifying-asynchronous-coding-async-functions/)

1. [NodeJS中文网-API文档](http://nodejs.cn/api/http.html)

1. <https://www.sitepoint.com/headless-chrome-node-js/>



