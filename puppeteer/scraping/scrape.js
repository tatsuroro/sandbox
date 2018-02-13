const puppeteer = require('puppeteer');
const Europa = require('node-europa');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const readdirAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);

const europa = new Europa({
  absolute: true,
  baseUri: 'https://about.kaizenplatform.com',
  inline: true
});

const basePostsPath = '../../../../kaizenplatform/kaizenplatform.in/source/posts/';

// scrape each page contents
const recursiveScrape = async (arr, fileList, page) => {
  for (let item of arr) {
    await new Promise(async resolve => {
      console.log(item.title);

      await page.goto(item.href, { timeout: 0 });
      await page.waitForSelector('article');

      // --- convert content to md
      const pageData = await page.$eval('.content', data => data.innerHTML);
      const pageMd = europa.convert(pageData);

      // --- read frontmatter
      const basePost = fileList.find(i => i.includes(item.title));
      if (!basePost) {
        resolve();
      }

      const baseArticleBuffer = await readFileAsync(`${basePostsPath}${basePost}`, { encode: 'utf8' });
      const baseArticle = baseArticleBuffer.toString('utf8');
      const frontmatter = baseArticle.split('---')[1];

      // --- concat
      const concatPage = '---'.concat(frontmatter, '---\n\n', pageMd);

      await writeFileAsync(`./md/${item.title}.md`, concatPage, 'utf8');

      resolve();
    })
  }
};

// main
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

  const fileNameList = await readdirAsync(basePostsPath);

  await recursiveScrape(articleList, fileNameList, page);

  await browser.close();
})();
