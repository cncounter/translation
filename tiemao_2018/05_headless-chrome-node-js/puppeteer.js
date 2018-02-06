// 加载依赖库
const puppeteer = require('puppeteer');

(async () => {
  // 创建浏览器实例
  const browser = await puppeteer.launch();
  // 打开新标签页
  const page = await browser.newPage();
  // 打开页面
  await page.goto('http://online.yiboshi.com/online/ysdk/login.html');
  // 截屏
  // await page.screenshot({path: 'online_ysdk_login.png'});
  //
  var pdf_option = {
          // 保存路径, 可以为绝对路径
          path: 'online_ysdk_login.pdf',        
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
              top    : '10px',
              right  : '10px',
              bottom : '10px',
              left   : '10px',
          }
      };
  // 模拟 screen 媒介样式来打印PDF
  await page.emulateMedia('screen');
  // 打印PDF
  await page.pdf(pdf_option);

  // 执行完成之后, 关闭浏览器
  await browser.close();
})();

/**

format options are:


*/