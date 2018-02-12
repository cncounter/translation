// 简单的截屏模块
// 提供2个方法: 
// initBrowser(); 初始化浏览器
// screenshot(config, browser); 
!(function(exports){

    // 加载依赖库
    const puppeteer = require('puppeteer');

    async function initBrowser(){
      // 创建浏览器实例
      const browser = await puppeteer.launch();
      return browser;
    };

    async function screenshot(config, browser){
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
        var screenshot_option = {
              // 保存路径, 绝对/相对路径
              path: path,
              // jpeg or png
              type: 'png',
              // 是否为全页面截屏, 默认 false
              fullPage : true,
              // 省略白色背景, 可能为透明, 默认 false
              omitBackground : false
              // 图片质量; 0-100, png无效
              // ,quality: 100
              // 指定截屏范围
              /*
              ,clip : {
                  x  : 0,
                  y  : 0,
                  width : '1cm',
                  height   : '1cm',
              }*/
          };
      // 模拟 screen 媒介样式来截屏screenshot
      await pageTab.emulateMedia('screen');
      // 截屏screenshot
      // Promise which resolves to buffer with captured screenshot
      var buffer = await pageTab.screenshot(screenshot_option);

      // 关闭标签页
      await pageTab.close()
      // 执行完成之后, 关闭浏览器
      if(needCloseBrowser){
        await browser.close();
      }
    };

    //
    exports.initBrowser = initBrowser;
    exports.screenshot = screenshot;

// end
})(exports);