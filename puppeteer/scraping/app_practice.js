const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disanle-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto('https://kaizenplatform.com/ja/');

  // something

  const scrapingData = await page.evaluate(() => {
    const dataList = [];
    const nodeList = document.querySelectorAll('main');
    nodeList.forEach(_node => {
      dataList.push(_node.innerHTML);
    })

    return dataList;
  });

  fs.writeFile('result.txt', JSON.stringify(scrapingData), (err) => {
    if (err) throw err;
    console.log('done');
  });

  browser.close();
})();
