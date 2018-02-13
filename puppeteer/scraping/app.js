const puppeteer = require('puppeteer');
const fs = require('fs');

const listUrl = 'https://kaizenplatform.com/pressrelease/';

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disanle-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto(listUrl);

  // get list of url
  const scrapingData = await page.$$eval('ul > li > a', nodeList => {
    const dataList = [];

    nodeList.forEach(_node => {
      if (!_node.href.includes('pressrelease')) {
        return;
      }

      const data = {
        href: _node.href,
        title: _node.href.replace('https://kaizenplatform.com/pressrelease/', '').replace('.html', '').replace(/\//g, '-')
      };

      dataList.push(data);
    });

    return dataList;
  });

  fs.writeFile('list.json', JSON.stringify(scrapingData), (err) => {
    if (err) throw err;
    console.log(' write done');
  });

  browser.close();
})();
