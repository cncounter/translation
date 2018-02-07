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