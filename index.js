const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const FormatJson = require("./util").FormatJson;
const genEpubUrl = require("./util").genEpubUrl;
const genCatalogUrl = require("./util").genCatalogUrl;

// !!! thor 的值粘贴到下边的变量里 !!!
let thor = "";
// !!!!!!
let bookId = "";
let readType = "";

const fetchAndSave = async (chapterId) => {
  const url = genEpubUrl("/read/gC.action", bookId, chapterId, readType);
  const res = await fetch(`https://cread.jd.com${url}`, {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      cookie: `thor=${thor};`,
    },
    referrer:
      "https://cread.jd.com/read/startRead.action?bookId=30334444&readType=1",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  });
  const json = await res.json();
  if (json.code !== "0") {
    console.log("❌ 抓取出错: ", json.msg);
    return;
  }
  console.log("✅ : chapterId", chapterId);
  const real = FormatJson.formatContent(json.content);
  const html = real.contentList[0].content;
  await fs.outputFile(
    path.join(__dirname, "output", bookId, `${chapterId}.html`),
    html
  );
};

const fetchCatalog = async () => {
  const url = genCatalogUrl("/read/lC.action", bookId, readType);
  const res = await fetch(`https://cread.jd.com${url}`, {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      cookie: `thor=${thor};`,
    },
    referrer:
      "https://cread.jd.com/read/startRead.action?bookId=30410212&readType=3",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  });
  const json = await res.json();
  if (json.code !== "0") {
    console.log("❌ 抓取出错: ", json.msg);
    return;
  }
  const real = FormatJson.formatContent(json.content);
  return real.catalogList;
};

const genIndexHtml = async (catalog) => {
  const lis = [];
  catalog.forEach((item) => {
    if (item.level === 0) {
      lis.push(
        `<li><a href="./${item.catalogId}.html">${item.catalogName}</a></li>`
      );
    } else {
      lis.push(
        `<li style="text-indent: ${item.level}em;"><a href="./${item.catalogId}.html">${item.catalogName}</a></li>`
      );
    }
  });
  const html = `
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="http://storage.360buyimg.com/ebooks/9fd8bb77eb40456b746aaae41785499a_new_.css" />
    <title>目录</title>
  </head>
  <body>
    <ul>${lis.join("")}</ul>  
  </body>
</html>
`;
  await fs.outputFile(
    path.join(__dirname, "output", bookId, `index.html`),
    html
  );
};

const fire = async () => {
  console.log();
  console.log(
    "请事先将页面 cookie 中的 thor 值拷贝到 index.js 中的 thor 变量里!"
  );
  console.log();
  const answers = await inquirer.prompt([
    { name: "step1", type: "input", message: "请输入 bookId: " },
    { name: "step2", type: "input", message: "请输入 readType: " },
  ]);
  bookId = answers.step1;
  readType = answers.step2;
  const catalog = await fetchCatalog();
  if (!catalog) return;
  await fs.ensureDir(path.join(__dirname, "output", bookId));
  await genIndexHtml(catalog);
  for (let i = 0; i < catalog.length; i++) {
    const chapterId = catalog[i].catalogId;
    await fetchAndSave(chapterId);
  }
  console.log("抓取完毕!");
};
fire();
