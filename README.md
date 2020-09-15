一键导出京东阅读已购买的电子书, [导出格式示例](./output/30410212/index.html), [相关博文](http://poppython.com/blog/export_jd_read.html)

## 如何使用
step0: 下载代码, 并安装依赖

```bash
git clone https://github.com/rmlzy/export_jd_read.git
cd hack_jd_read
npm install
```

step1:
登录[京东读书](https://e.jd.com/), 拷贝页面 cookie 中的 thor 值, 到 `index.js` 的 `thor` 变量里

![](./assets/step1.jpg)

step2: 在我的已购电子书页面, 点击 "在线阅读" 按钮
![](./assets/step2.jpg)

step3: 记住页面 URL 地址中的 `bookId` 和 `readType` 参数, 例如: `https://cread.jd.com/read/startRead.action?bookId=30506710&readType=3`

step4: 执行 `npm run start`, 并输入 step3 的 `bookId` 和 `readType` 值即可

程序会自动将导出的章节存储到 `output` 目录.

## 使用说明
+ 此脚本不会保存或者上传你的 Cookie;
+ 如有侵权请联系我删除!

## LICENSE
WTFPL
