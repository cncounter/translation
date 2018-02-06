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