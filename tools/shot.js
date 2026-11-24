// Serves a folder on 127.0.0.1 and screenshots its index page at desktop and phone width, in slices.
// usage: node shot.js <site-dir> <out-prefix> [url]   (with a url, that page is shot instead of the local folder)
const fs = require("fs");
const http = require("http");
const path = require("path");
// Playwright is not a dependency of this folder: install it, or point PLAYWRIGHT_PATH at an existing copy.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const [, , siteDir, outPrefix, remoteUrl] = process.argv;
const TYPES = { ".html": "text/html; charset=utf-8", ".woff2": "font/woff2", ".pdf": "application/pdf" };

const server = http.createServer((request, response) => {
  const name = decodeURIComponent(request.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.join(siteDir, name);
  if (!file.startsWith(path.resolve(siteDir)) || !fs.existsSync(file)) {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = remoteUrl || "http://127.0.0.1:" + server.address().port + "/";
  const browser = await chromium.launch();
  for (const [name, width, height, slice] of [["desktop", 1280, 900, 1300], ["mobile", 390, 844, 1700]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: "light" });
    const page = await context.newPage();
    const failed = [];
    page.on("requestfailed", (request) => failed.push(request.url()));
    page.on("response", (response) => response.status() >= 400 && failed.push(response.status() + " " + response.url()));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
      fonts: [...document.fonts].map((font) => font.weight + " " + font.style + " " + font.status),
      overflowing: [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .map((el) => el.tagName + "." + el.className)
        .slice(0, 10),
      bodyFont: getComputedStyle(document.body).fontFamily,
    }));
    console.log(name, JSON.stringify(info), "failed:", JSON.stringify(failed));
    for (let y = 0, index = 1; y < info.height; y += slice, index += 1) {
      await page.screenshot({
        path: outPrefix + "-" + name + "-" + index + ".png",
        fullPage: true,
        clip: { x: 0, y, width, height: Math.min(slice, info.height - y) },
      });
    }
    await context.close();
  }
  await browser.close();
  server.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
