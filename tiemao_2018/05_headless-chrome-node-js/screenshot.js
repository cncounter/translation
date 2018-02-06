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