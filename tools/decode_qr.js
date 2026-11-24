// Decodes every PNG in a folder as a QR code and prints what each one contains.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");
const jsQR = require("jsqr");

const dir = process.argv[2];
let failed = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort()) {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, file)));
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (!result) failed += 1;
  console.log(file, result ? result.data : "NOT DECODED");
}
console.log("failed:", failed);
process.exit(failed ? 1 : 0);
