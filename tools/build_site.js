// Builds the online version of the CV: one static page for GitHub Pages, from the same content as the .docx.
const fs = require("fs");
const path = require("path");
const { cv, play, appStore, SITE_URL } = require("./build_cv.js");

const OUT_DIR = process.argv[2] || path.join(__dirname, ".."); // the repository root is the published site
const PDF_NAME = "Haitham-Basim-CV.pdf";
const FONT_SOURCE = path.join(__dirname, "node_modules", "@fontsource", "lato");
// The PDF is set in Carlito, which is Lato with Calibri's metrics, so Lato keeps the page and the PDF alike.
const FONTS = [
  ["lato-latin-400-normal.woff2", "lato-400.woff2", "normal", 400],
  ["lato-latin-400-italic.woff2", "lato-400-italic.woff2", "italic", 400],
  ["lato-latin-700-normal.woff2", "lato-700.woff2", "normal", 700],
];

const esc = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const [role, stack] = cv.headline.split("|").map((part) => part.trim());
const [city, phone, email] = cv.contact;
const description = cv.summary.split(". ")[0] + ".";
const updated = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

const section = (title, body) => `
    <section aria-labelledby="${slug(title)}">
      <h2 id="${slug(title)}">${esc(title)}</h2>
      <div class="content">${body}
      </div>
    </section>`;

const storeLink = (appName, label, url) =>
  `<a href="${esc(url)}" aria-label="${esc(appName)}: ${esc(label)}">${esc(label)}</a>`;

const entry = (item) => {
  const name = item.company || item.name;
  const place = item.url ? `<a href="${esc(item.url)}">${esc(item.place)}</a>` : esc(item.place || "");
  const lines = [
    item.title && `<p class="role">${esc(item.title)}</p>`,
    item.note && `<p class="note">${esc(item.note)}</p>`,
    item.intro && `<p>${esc(item.intro)}</p>`,
    item.tech && `<p><strong>Technologies:</strong> ${esc(item.tech)}</p>`,
    item.links && `<p class="links">${item.links.map(([label, url]) => storeLink(name, label, url)).join("")}</p>`,
  ].filter(Boolean);
  return `
        <article class="entry">
          <div class="entry-head">
            <h3>${esc(name)}${item.place ? `<span class="place">, ${place}</span>` : ""}</h3>
            <p class="dates">${esc(item.dates)}</p>
          </div>
          ${lines.join("\n          ")}
          <ul>
            ${item.bullets.map((text) => `<li>${esc(text)}</li>`).join("\n            ")}
          </ul>
        </article>`;
};

const education = entry({
  name: cv.education.degree,
  dates: cv.education.dates,
  intro: cv.education.school + ", " + cv.education.place,
  bullets: cv.education.bullets,
});

const skills = `
        <dl class="skills">
          ${cv.skills.map(([label, items]) => `<dt>${esc(label)}</dt>\n          <dd>${esc(items)}</dd>`).join("\n          ")}
        </dl>`;

const apps = `
        <p>${esc(cv.apps.intro)}</p>
        <ul class="apps">
          ${cv.apps.list
            .map(
              ([name, what, playId, appleId]) => `<li>
            <div><strong>${esc(name)}</strong><span class="what">${esc(what)}</span></div>
            <div class="stores">${storeLink(name, "Google Play", play(playId))}${storeLink(name, "App Store", appStore(appleId))}</div>
          </li>`,
            )
            .join("\n          ")}
        </ul>`;

const fontFaces = FONTS.map(
  ([, file, style, weight]) =>
    `@font-face{font-family:"Lato";font-style:${style};font-weight:${weight};font-display:swap;src:url("fonts/${file}") format("woff2")}`,
).join("\n");

const css = `${fontFaces}
:root{--navy:#1f3864;--ink:#1f2328;--muted:#5b6370;--rule:#c9d2e3;--link:#0b57c2;color-scheme:light}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#fff;color:var(--ink);font:400 1.0625rem/1.55 "Lato",Carlito,Calibri,"Segoe UI",system-ui,sans-serif}
h1,h2,h3,p,ul,dl,dd{margin:0}
a{color:var(--link);text-underline-offset:.15em}
a:focus-visible{outline:2px solid var(--link);outline-offset:2px;border-radius:2px}
.page{max-width:60rem;margin:0 auto;padding:clamp(1.75rem,6vw,4.5rem) clamp(1.25rem,5vw,3rem) 3rem}

.masthead{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.25rem 2rem;align-items:start;padding-bottom:2.25rem}
h1{font-size:clamp(2.4rem,8vw,3.5rem);line-height:1.05;font-weight:700;letter-spacing:-.015em;color:var(--navy)}
.headline{margin-top:.6rem;font-size:1.25rem;line-height:1.35}
.stack{color:var(--muted)}
.contact{grid-column:1/-1;grid-row:2;display:flex;flex-wrap:wrap;gap:.25rem 2rem;padding:0;list-style:none}
.download{grid-column:2;grid-row:1;padding:.65rem 1.15rem;border-radius:.375rem;background:var(--navy);color:#fff;font-weight:700;text-decoration:none;white-space:nowrap}
.download:hover{background:#162a4c}
.download:focus-visible{outline-color:var(--navy)}

section{display:grid;grid-template-columns:10.5rem minmax(0,1fr);column-gap:2.5rem;padding:1.75rem 0;border-top:1px solid var(--rule)}
h2{font-size:.8125rem;line-height:1.75rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--navy)}
.content > * + *{margin-top:.6rem}

.entry + .entry{margin-top:1.75rem}
.entry > * + *{margin-top:.3rem}
.entry-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;column-gap:1.25rem}
h3{font-size:1.125rem;line-height:1.4;font-weight:700}
.place{font-size:1.0625rem;font-weight:400;color:var(--muted)}
.dates{color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.role{font-style:italic}
.note{color:var(--muted)}
.links{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem}
.entry ul{margin-top:.5rem;padding-left:1.15rem}
.entry li + li{margin-top:.3rem}

.skills{display:grid;grid-template-columns:10rem minmax(0,1fr);gap:.65rem 1.5rem}
.skills dt{font-weight:700}

.apps{padding:0;list-style:none}
.apps li{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:.1rem 1.25rem;padding:.6rem 0;border-top:1px solid var(--rule)}
.what{margin-left:.65rem;color:var(--muted)}
.stores{display:flex;gap:1.25rem;white-space:nowrap}

.foot{padding-top:1.25rem;border-top:1px solid var(--rule);color:var(--muted);font-size:.9375rem}

@media (max-width:46rem){
  .masthead{grid-template-columns:minmax(0,1fr)}
  .contact{grid-row:auto;flex-direction:column}
  .download{grid-column:auto;grid-row:auto;justify-self:start}
  section{grid-template-columns:minmax(0,1fr);row-gap:.5rem;padding:1.5rem 0}
  .entry-head{display:block}
  .skills{grid-template-columns:minmax(0,1fr);row-gap:0}
  .skills dd + dt{margin-top:.75rem}
  .what{display:block;margin-left:0}
}

@media print{
  body{font-size:10.5pt}
  .page{max-width:none;padding:0}
  .download{display:none}
  a{color:inherit;text-decoration:none}
  .entry,.apps li{break-inside:avoid}
}`;

const icon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E" +
  "%3Crect width='64' height='64' rx='12' fill='%231f3864'/%3E" +
  "%3Ctext x='32' y='43' font-family='Arial,sans-serif' font-size='28' font-weight='700' text-anchor='middle' fill='white'%3EHB%3C/text%3E%3C/svg%3E";

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(cv.name)} | ${esc(role)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(SITE_URL)}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(cv.name)} | ${esc(role)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(SITE_URL)}">
  <link rel="icon" href="${icon}">
  <style>
${css}
  </style>
</head>
<body>
<div class="page">
  <header class="masthead">
    <div class="identity">
      <h1>${esc(cv.name)}</h1>
      <p class="headline">${esc(role)}</p>
      <p class="stack">${esc(stack)}</p>
    </div>
    <ul class="contact">
      <li>${esc(city)}</li>
      <li><a href="tel:${esc(phone.replace(/\s/g, ""))}">${esc(phone)}</a></li>
      <li><a href="mailto:${esc(email)}">${esc(email)}</a></li>
    </ul>
    <a class="download" href="${PDF_NAME}" download>Download PDF</a>
  </header>

  <main>${section("Summary", `\n        <p>${esc(cv.summary)}</p>`)}
${section("Education", education)}
${section("Technical Skills", skills)}
${section("Experience", cv.experience.map(entry).join(""))}
${section("Projects", cv.projects.map(entry).join(""))}
${section("Published Apps", apps)}
  </main>

  <footer class="foot">Updated ${esc(updated)}</footer>
</div>
</body>
</html>
`;

fs.mkdirSync(path.join(OUT_DIR, "fonts"), { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "index.html"), html);
for (const [source, target] of FONTS) {
  fs.copyFileSync(path.join(FONT_SOURCE, "files", source), path.join(OUT_DIR, "fonts", target));
}
fs.copyFileSync(path.join(FONT_SOURCE, "LICENSE"), path.join(OUT_DIR, "fonts", "OFL.txt"));
fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), ""); // plain static files: no Jekyll build
console.log("wrote", path.join(OUT_DIR, "index.html"), html.length, "chars");
