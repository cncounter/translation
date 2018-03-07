// 加载依赖库
const puppeteer = require('puppeteer');

(async () => {
  // 创建浏览器实例
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  // 打开新标签页
  const page = await browser.newPage();
  // 打开页面
  const response = await page.goto('http://www.cncounter.com');
  //await page.setContent((await response.buffer()).toString('utf8'));
  // 截屏; path 可以使用相对路径或者绝对路径
  await page.screenshot({path: 'cncounter_home.png'});
  // 执行完成之后, 关闭浏览器
  await browser.close();
})();