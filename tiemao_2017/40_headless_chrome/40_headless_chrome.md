# Chrome Headless 命令行操作简介

> `Headless` 是指没有GUI界面,运行在后台的程序。

本文简要介绍如何使用命令行来调用 Chrome 执行后台任务。 关于 NodeJS 和 C++ 的API调用, 请参考本文末尾的相关链接。

Headless Chrome is shipping in Chrome 59. It's a way to run the Chrome browser in a headless environment. Essentially, running Chrome without chrome! It brings all modern web platform features provided by Chromium and the Blink rendering engine to the command line.

Chrome Headless 模式从 Chrome 59 版本开始提供! 它使所有现代web平台特性提供的铬和眨眼的渲染引擎命令行。


### Headless模式用来做什么?

A headless browser is a great tool for automated testing and server environments where you don't need a visible UI shell. For example, you may want to run some tests against a real web page, create a PDF of it, or just inspect how the browser renders an URL.

无头浏览器自动化测试是一个伟大的工具和服务器环境中你不需要一个可见的UI层.例如,您可能想要运行一些测试对一个真正的web页面,创建一个PDF,或只是检查浏览器如何呈现一个URL。




生成页面加载后的截图:

chrome --headless --screenshot=C:/cncounter.screenshot.png  http://www.cncounter.com

重定向地址也可以截图, 因为是 loaded 之后再保存:

chrome --headless --screenshot=C:/cncounter_.screenshot.png  --window-size=1024,768 http://cncounter.com


页面加载后保存为PDF文件:

chrome --headless --print-to-pdf=C:/cncounter.output.pdf  http://www.cncounter.com


自定义 user-agent:

chrome --headless --user-agent="Renfufei.Test 02" --print-to-pdf=C:/snoop.pdf  http://renfufei.com/snoop.jsp


指定超时时间, 超过此时间测会强制触发 DOMContentLoaded 事件。 

--timeout

指定 repl 以执行JS脚本:

chrome --headless --repl http://renfufei.com


--window-size=800,600


--print-to-pdf=C:/www.cncounter.pdf

--dump-dom


--user-data-dir

--screenshot









参考链接:

1. [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

1. [Chrome-Headless模式shell命令行参数1](https://cs.chromium.org/chromium/src/headless/app/headless_shell.cc)

1. [Chrome-Headless模式shell命令行开关](https://cs.chromium.org/chromium/src/headless/app/headless_shell_switches.cc)

1. [DIV.IO中文文章: Chrome Headless 模式  ](https://div.io/topic/1978)

1. [Headless Chromium README.md](https://chromium.googlesource.com/chromium/src/+/master/headless/README.md)

1. [Chrome DevTools Protocol ](https://chromedevtools.github.io/devtools-protocol/)

1. [Automated testing with Headless Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai)

