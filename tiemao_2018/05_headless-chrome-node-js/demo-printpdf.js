// 加载依赖库
const puppeteer = require('puppeteer');

(async () => {
  // 创建浏览器实例
  const browser = await puppeteer.launch();
  // 打开新标签页
  const page = await browser.newPage();
  // 打开页面
  await page.goto('http://www.cncounter.com');
  // 配置选项
  var pdf_option = {
          // 保存路径, 可以为绝对路径
          path: 'cncounter_home.pdf', 
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
  // 可以设置媒介样式为 screen, 默认则是打印机'print' 
  await page.emulateMedia('screen');
  // 打印PDF
  await page.pdf(pdf_option);

  // 执行完成, 关闭浏览器
  await browser.close();
})();