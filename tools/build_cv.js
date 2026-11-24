// Builds Haitham Basim's CV as a .docx (A4, single column, ATS-friendly).
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const {
  Document, Packer, Paragraph, TextRun, Tab, AlignmentType, TabStopType, LevelFormat, BorderStyle,
  HeadingLevel, ExternalHyperlink, Table, TableRow, TableCell, WidthType, ImageRun, VerticalAlign,
} = require("docx");

const OUT = process.argv[2] || path.join(__dirname, "out", "Haitham-Basim-CV-2026.docx");

const FONT = "Calibri";
const NAVY = "1F3864";
const GREY = "595959";
const LINK = "0563C1";
const MARGIN = 1080; // 0.75 in
const CONTENT_WIDTH = 11906 - 2 * MARGIN; // A4 width minus margins

const play = (id) => "https://play.google.com/store/apps/details?id=" + id;
const appStore = (id) => "https://apps.apple.com/iq/app/id" + id; // Iraq storefront: every app is listed there
const SITE_URL = "https://haithambasim.github.io/cv/"; // the online version of this CV (GitHub Pages)

// ---------------------------------------------------------------- content
const cv = {
  name: "Haitham Basim",
  headline: "Senior Full-Stack Developer  |  .NET, ABP Framework, React, TypeScript, React Native",
  contact: ["Baghdad, Iraq", "+964 781 062 8096", "h.b.h.irs@outlook.com"],

  summary:
    "Full-stack developer with 10 years of experience building enterprise and government software: " +
    "a national judicial case-management platform, the Iraq Food and Drug Administration system, ERP and e-commerce products. " +
    "Works across modular .NET backends on ABP Framework, React and TypeScript front ends, and React Native " +
    "mobile apps published on Google Play and the App Store. Experienced in building secure, auditable systems.",

  skills: [
    ["Backend", "C#, .NET 10, ASP.NET Core (Web API, MVC, Razor Pages), ABP Framework, Entity Framework Core, " +
      "domain-driven design, modular monolith and microservices architecture, OpenIddict, Hangfire and background jobs, " +
      "SignalR, REST APIs, Swagger / OpenAPI"],
    ["Frontend", "React 19, Next.js, TypeScript, JavaScript, Vue 3, Vite, Ant Design, Tailwind CSS, TanStack Query, " +
      "Zustand, Redux Toolkit, Zod, React Router, CASL, i18next, HTML, CSS, Bootstrap, jQuery"],
    ["Mobile", "React Native, Expo (white-label apps, push notifications, over-the-air updates), " +
      "publishing to Google Play and the App Store"],
    ["Databases and messaging", "PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, Redis (caching, sessions, " +
      "distributed locks), RabbitMQ, Elasticsearch"],
    ["Identity and security", "Keycloak (multi-realm setup, custom Java authenticators, OTP and passkey sign-in), " +
      "OAuth 2.0 / OpenID Connect, Backend-for-Frontend sessions, permission-based authorization, CSRF protection, audit logging"],
    ["Testing and code quality", "xUnit, Shouldly, NSubstitute, Testcontainers, Vitest, React Testing Library, " +
      "Playwright, jest-axe (accessibility), ESLint, Semgrep, Gitleaks, SonarQube"],
    ["DevOps and tools", "Docker, Docker Compose, Kubernetes (Helm), GitHub Actions, Jenkins, Git (GitHub, GitLab, " +
      "Bitbucket), Serilog, Postman, Jira, Visual Studio, VS Code, DBeaver, pgAdmin, AI-assisted development (Claude Code)"],
    ["Integrations", "Payment gateways and webhooks, S3 object storage, Firebase push notifications, PDF, Excel and " +
      "QR-code generation, email and SMS OTP, fingerprint devices (ZKTeco, FingerTec, Anviz), Zoom, Jitsi Meet"],
    ["Also worked with", "PHP (CodeIgniter), Python scripting, Windows Forms desktop applications, Google Chrome extensions"],
  ],

  experience: [
    {
      company: "Elm Arkan",
      place: "Iraq",
      dates: "May 2026 – Present",
      title: "Senior Full Stack Developer",
      note: "Iraqi company affiliated with Elm Company, Saudi Arabia.",
      intro:
        "Project: a national judicial case-management platform for courts, citizens and lawyers. " +
        "One modular backend, three web portals, an administration app and a public document-verification site.",
      tech:
        ".NET 10, ABP Framework 10, EF Core, PostgreSQL, Redis, RabbitMQ, Keycloak, React 19, TypeScript, Vite, " +
        "Ant Design 6, TanStack Query, Docker, xUnit, Vitest, Playwright.",
      bullets: [
        "Develop backend modules of a modular monolith of about 20 modules (case and workflow engine, payments, " +
          "person records, hearings), each with its own PostgreSQL schema.",
        "Keep modules independent: they talk only through RabbitMQ distributed events and synchronous integration contracts.",
        "Build the citizen, lawyer and judge portals in one npm workspaces monorepo with a shared library of case " +
          "forms and components.",
        "Implement sign-in and access control through a multi-realm Keycloak Backend-for-Frontend: server-side " +
          "sessions, OpenID Connect, CSRF protection and permission-based authorization.",
        "Deliver the billing flow: fee packages tied to workflow statuses, invoices, payment-gateway integration " +
          "with webhooks, and electronic receipts.",
        "Built a standalone public app (ASP.NET Core Razor Pages, PostgreSQL, S3) that verifies issued documents by QR code.",
        "Cover changes with automated tests and maintain the project's technical standards, architecture decision " +
          "records and the API specification for the external mobile-app team.",
      ],
    },
    {
      company: "Al-Muraba Co.",
      place: "Iraq",
      dates: "Feb 2022 – May 2026",
      title: "Senior Full Stack Developer",
      bullets: [
        "Sole backend developer and main front-end developer of the Iraq Food and Drug Administration (IFDA) system " +
          "from its first commit: drug registration and pricing, manufacturing sites, scientific offices, committee " +
          "sessions and decisions, certificates, workflows and invoicing.",
        "IFDA stack: ABP Framework, EF Core, MySQL, OpenIddict, Hangfire, Firebase notifications, S3 storage and a " +
          "payment gateway, with React, Ant Design, Redux Toolkit, SignalR and CASL on the front end.",
        "Designed and built Cardify (card issuing, templates and print tracking) and Taxfy (company payroll and " +
          "salary tax), each an ABP backend with a React admin dashboard.",
        "Contributed to the Doctor Management Information System (DMIS): ABP backend, Vue 3 front end, a public " +
          "card-verification site and Python scripts that migrated data from the legacy system.",
        "Contributed to Muraba ERP, a microservices solution on ABP (HR, documents, projects, master data, identity) " +
          "with a Vue 3 front end.",
        "Built a reusable notification module on ABP Framework.",
      ],
    },
    {
      company: "Freelance Developer",
      place: "Baghdad, Iraq",
      dates: "Feb 2021 – Feb 2022",
      bullets: ["Developed mobile apps for Al-Nokhba Labs."],
    },
    {
      company: "Enjaz Co.",
      place: "Baghdad, Iraq",
      dates: "Feb 2020 – Feb 2021",
      title: "Full Stack Developer",
      bullets: [
        "Developed a Learning Management System, a University Management System and an HR system as part of a team, " +
          "from requirements gathering through delivery.",
      ],
    },
    {
      company: "Alhadetha Co. for Software and Automation",
      place: "Baghdad, Iraq",
      dates: "Sep 2016 – Feb 2020",
      title: "Full Stack Developer",
      bullets: [
        "Built C# backends and web front ends for an ERP system, a Warehouse Management System, a Document " +
          "Management System and a PDA van-sales application, working in a team.",
        "Independently delivered an e-commerce API and its Android and iOS mobile app.",
      ],
    },
  ],

  projects: [
    {
      name: "Jamkhana",
      place: "jamkhana.com",
      url: "https://jamkhana.com", // the web page links the place; the .docx prints it as text
      dates: "2021 – Present",
      title: "Own project: an e-commerce platform for Iraqi merchants",
      bullets: [
        "Gives each merchant a branded website, mobile app and merchant panel on one platform, with multilingual " +
          "support, several payment methods and live notifications.",
        "Built the merchant panel (Next.js, React, TypeScript, Tailwind CSS) and contributed to the .NET 10 API " +
          "(EF Core, PostgreSQL, Redis, Elasticsearch, Hangfire, Firebase, S3).",
        "Built a white-label React Native / Expo shopping app: one codebase configured per merchant and released " +
          "as separate branded apps on Google Play and the App Store.",
      ],
    },
    {
      name: "AlWekeel",
      place: "Iraqi legal reference app",
      dates: "2026",
      links: [
        ["alwekeel.com", "https://alwekeel.com"],
        ["Google Play", play("com.alwekeel.app")],
        ["App Store", appStore("6797253894")],
      ],
      bullets: [
        "Brings the texts of Iraqi laws, legal news, a lawyers directory and training courses into one app.",
        "React Native / Expo app with a .NET API and a React admin panel, deployed with Docker and Jenkins.",
      ],
    },
  ],

  apps: {
    intro: "Built and published under the Jamkhana developer account.",
    printHint: "Scan a code, or click the label under it, to open the store page.", // .docx / PDF only
    perRow: 4,
    list: [
      ["Jamkhana", "Shopping marketplace", "com.jamkhana.app", "6736534343"],
      ["AlWekeel", "Iraqi laws reference", "com.alwekeel.app", "6797253894"],
      ["Steel", "Online store", "steel.jamkhana.app", "6743664033"],
      ["Golden Gate", "Online store", "goldengate.jamkhana.app", "6753710404"],
      ["Target", "Online store", "target.jamkhana.app", "6759577472"],
      ["Zoom Dent", "Dental supplies store", "zoomdent.jamkhana.app", "6800627696"],
      ["Via Dent", "Dental supplies store", "viadent.jamkhana.app", "6804066705"],
      ["Barahtak Qastaha", "Home appliances store", "barahtakqastaha.jamkhana.app", "6808034304"],
    ],
  },

  education: {
    degree: "Bachelor of Software Engineering",
    school: "Iraqi University",
    place: "Baghdad, Iraq",
    dates: "Graduated June 2016",
    bullets: ["GPA 84.33, graduated in the top 5% of the class."],
  },
};

// ---------------------------------------------------------------- helpers
const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: 22, ...opts });

const link = (text, url, opts = {}) =>
  new ExternalHyperlink({ link: url, children: [run(text, { color: LINK, underline: {}, ...opts })] });

// "Google Play · App Store" as a list of runs and hyperlinks.
const linkRuns = (pairs) =>
  pairs.flatMap(([text, url], i) => (i === 0 ? [link(text, url)] : [run("  ·  ", { color: GREY }), link(text, url)]));

const rightTab = { tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }] };
const tab = () => new TextRun({ children: [new Tab()], font: FONT, size: 22 });

const sectionHeading = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, size: 24, color: NAVY, characterSpacing: 20 })],
  });

const entryHeader = (left, place, dates, before = 160) =>
  new Paragraph({
    keepNext: true,
    spacing: { before, after: 0 },
    ...rightTab,
    children: [
      run(left, { bold: true, size: 23 }),
      ...(place ? [run(", " + place, { color: GREY })] : []),
      tab(),
      run(dates, { color: GREY }),
    ],
  });

const subLine = (children, keepNext = true) =>
  new Paragraph({ keepNext, spacing: { before: 0, after: 40 }, children });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 0, after: 40 },
    children: [run(text)],
  });

const entry = (item, index) => {
  const out = [entryHeader(item.company || item.name, item.place, item.dates, index === 0 ? 0 : 160)];
  if (item.title) out.push(subLine([run(item.title, { italics: true })]));
  if (item.note) out.push(subLine([run(item.note, { color: GREY })]));
  if (item.intro) out.push(subLine([run(item.intro)], false));
  if (item.tech) out.push(subLine([run("Technologies: ", { bold: true }), run(item.tech)], false));
  if (item.links) out.push(subLine(linkRuns(item.links)));
  item.bullets.forEach((b) => out.push(bullet(b)));
  return out;
};

// ---- app grid: one card per app, a QR code for each store (works on paper), labels are clickable links
const QR_SIZE = 70; // px at 96 dpi, about 1.85 cm
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

const centered = (children, after = 0, keepNext = true) =>
  new Paragraph({ alignment: AlignmentType.CENTER, keepNext, spacing: { before: 0, after, line: 240 }, children });

const appGrid = (apps, perRow, qrImages) => {
  const columns = perRow * 2; // two store columns per app
  const columnWidth = Math.floor(CONTENT_WIDTH / columns);
  const cell = (children, columnSpan = 1) =>
    new TableCell({
      width: { size: columnWidth * columnSpan, type: WidthType.DXA },
      columnSpan,
      borders: NO_BORDERS,
      margins: { top: 0, bottom: 0, left: 40, right: 40 },
      verticalAlign: VerticalAlign.TOP,
      children,
    });
  const qrCell = (appName, label, url) =>
    cell([
      centered([
        new ImageRun({
          type: "png",
          data: qrImages.get(url),
          transformation: { width: QR_SIZE, height: QR_SIZE },
          altText: { name: appName + " " + label, title: appName + " on " + label, description: "QR code for " + url },
        }),
      ]),
      centered([link(label, url, { size: 20 })], 200, false),
    ]);

  const rows = [];
  for (let i = 0; i < apps.length; i += perRow) {
    const group = apps.slice(i, i + perRow);
    rows.push(
      new TableRow({
        cantSplit: true,
        children: group.map(([name, what]) =>
          cell([centered([run(name, { bold: true })]), centered([run(what, { size: 20, color: GREY })], 60)], 2)),
      }),
      new TableRow({
        cantSplit: true,
        children: group.flatMap(([name, , playId, appleId]) => [
          qrCell(name, "Google Play", play(playId)),
          qrCell(name, "App Store", appStore(appleId)),
        ]),
      }),
    );
  }
  return new Table({
    width: { size: columnWidth * columns, type: WidthType.DXA },
    columnWidths: Array(columns).fill(columnWidth),
    borders: { ...NO_BORDERS, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
    rows,
  });
};

// ---- header: name, headline and contact on the left, a QR code for the online version on the right
const SITE_QR_SIZE = 80; // px at 96 dpi, about 2.1 cm
const SITE_QR_COLUMN = 1300; // DXA, just wider than the code

const header = (qrImage) => {
  const cell = (width, children) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      borders: NO_BORDERS,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      verticalAlign: VerticalAlign.TOP,
      children,
    });
  const line = (children, after) => new Paragraph({ spacing: { before: 0, after }, children });
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH - SITE_QR_COLUMN, SITE_QR_COLUMN],
    // No indent and no cell padding, so the name lines up with the body text in Word and in LibreOffice.
    indent: { size: 0, type: WidthType.DXA },
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    borders: { ...NO_BORDERS, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          cell(CONTENT_WIDTH - SITE_QR_COLUMN, [
            line([run(cv.name, { bold: true, size: 52, color: NAVY })], 20),
            line([run(cv.headline, { size: 24, color: GREY })], 40),
            line([run(cv.contact.join("   ·   "))], 0),
          ]),
          cell(SITE_QR_COLUMN, [
            centered([
              new ImageRun({
                type: "png",
                data: qrImage,
                transformation: { width: SITE_QR_SIZE, height: SITE_QR_SIZE },
                altText: { name: "Online CV", title: "Online version of this CV", description: "QR code for " + SITE_URL },
              }),
            ]),
            centered([link("Online CV", SITE_URL, { size: 18 })], 0, false),
          ]),
        ],
      }),
    ],
  });
};

// ---------------------------------------------------------------- build
async function main() {
  const qrImages = new Map();
  qrImages.set(SITE_URL, await QRCode.toBuffer(SITE_URL, { errorCorrectionLevel: "M", margin: 2, scale: 10 }));
  for (const [, , playId, appleId] of cv.apps.list) {
    for (const url of [play(playId), appStore(appleId)]) {
      qrImages.set(url, await QRCode.toBuffer(url, { errorCorrectionLevel: "M", margin: 2, scale: 10 }));
    }
  }

  const body = [
    header(qrImages.get(SITE_URL)),

    sectionHeading("Summary"),
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [run(cv.summary)] }),

    sectionHeading("Education"),
    entryHeader(cv.education.degree, "", cv.education.dates, 0),
    subLine([run(cv.education.school + ", " + cv.education.place)]),
    ...cv.education.bullets.map(bullet),

    sectionHeading("Technical Skills"),
    ...cv.skills.map(
      ([label, items]) =>
        new Paragraph({
          spacing: { before: 0, after: 50 },
          children: [run(label + ": ", { bold: true }), run(items)],
        }),
    ),

    sectionHeading("Experience"),
    ...cv.experience.flatMap(entry),

    sectionHeading("Projects"),
    ...cv.projects.flatMap(entry),

    sectionHeading("Published Apps"),
    new Paragraph({
      keepNext: true,
      spacing: { before: 0, after: 140 },
      children: [run(cv.apps.intro + " " + cv.apps.printHint)],
    }),
    appGrid(cv.apps.list, cv.apps.perRow, qrImages),
  ];

  const doc = new Document({
    creator: cv.name,
    title: cv.name + " - CV",
    description: "Curriculum vitae of " + cv.name,
    styles: {
      default: {
        document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { line: 264 } } },
        heading1: {
          run: { font: FONT, size: 24, bold: true, color: NAVY },
          paragraph: { spacing: { before: 260, after: 100 }, keepNext: true },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 340, hanging: 220 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
        children: body,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buffer);
  console.log("wrote", OUT, buffer.length, "bytes");
}

// The web page (build_site.js) is generated from the same content.
module.exports = { cv, play, appStore, SITE_URL };

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
