import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const templatePath = path.join(distDir, "index.html");
const ssrEntry = path.join(ssrDir, "entry-server.js");

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing build template: ${templatePath}`);
}
if (!fs.existsSync(ssrEntry)) {
  throw new Error(`Missing SSR bundle: ${ssrEntry}`);
}

const template = fs.readFileSync(templatePath, "utf8");
const { render, PRERENDER_PATHS, SITEMAP_PATHS } = await import(
  pathToFileURL(ssrEntry).href
);

const rootMarker = '<div id="root">';

function outputPathFor(url) {
  if (url === "/") return path.join(distDir, "index.html");
  if (url === "/404") return path.join(distDir, "404.html");
  return path.join(distDir, `${url}.html`);
}

for (const url of PRERENDER_PATHS) {
  const rendered = render(url);
  const markerIndex = rendered.indexOf(rootMarker);

  if (markerIndex < 0) {
    throw new Error(`Could not find ${rootMarker} while rendering ${url}`);
  }

  const headHtml = rendered.slice(0, markerIndex).trim();
  const rootHtml = rendered.slice(markerIndex);

  if (!headHtml.includes("<title")) {
    throw new Error(`Prerender produced no title for ${url}`);
  }

  const html = template
    .replace("</head>", `${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', rootHtml);

  if (html === template) {
    throw new Error(`Failed to inject prerendered markup for ${url}`);
  }

  const output = outputPathFor(url);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, "utf8");
  console.log(`prerendered ${url} -> ${path.relative(root, output)}`);
}

const lastmod = new Date().toISOString().slice(0, 10);
const urls = SITEMAP_PATHS.map((url) => {
  const loc = new URL(url, "https://hydr.codes").toString();
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
console.log(`wrote sitemap with ${SITEMAP_PATHS.length} URLs`);

fs.rmSync(ssrDir, { recursive: true, force: true });
