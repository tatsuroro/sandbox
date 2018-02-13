const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disanle-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();

  const articleBuffer = await readFileAsync('list.json', { encode: 'utf8' });
  const articleList = JSON.parse(articleBuffer);

  const scrapeData = [];

  // scrape each page contents
  const recursiveScrape = async (arr) => {
    for (let item of arr) {
      await new Promise(async resolve => {
        console.log(item.title);

        await page.goto(item.href);
        await page.waitForSelector('article');

        const pageData = await page.$eval('article', data => data.innerHTML);

        // scrapeData.push({
        //   data: pageData,
        //   title: item.title
        // });

        await writeFileAsync(`./html/${item.title}.html`, JSON.stringify(pageData));

        resolve();
      })
    }
  };

  await recursiveScrape(articleList);

  // console.log(scrapeData);

  await browser.close();
})();
