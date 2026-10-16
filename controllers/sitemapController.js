const { Article, Story } = require('../models');

const BASE_URL = "https://exaque.com";

function xmlEscape(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizePath(path) {
  if (!path || path === "/") return "/";
  const clean = "/" + String(path).replace(/^\/+|\/+$/g, "");
  return clean.toLowerCase();
}

function renderSitemap(pages) {
  const seen = new Set();

  const valid = pages
    .filter((p) => p && p.published === true && p.indexable === true)
    .map((p) => ({
      ...p,
      path: normalizePath(p.path),
      canonicalPath: normalizePath(p.canonicalPath || p.path),
    }))
    .filter((p) => p.path === p.canonicalPath)
    .filter((p) => {
      if (seen.has(p.path)) return false;
      seen.add(p.path);
      return true;
    });

  const urls = valid.map((p) => {
    const loc = `${BASE_URL}${p.path === "/" ? "/" : p.path}`;
    const lastmod = p.updatedAt
      ? `\n    <lastmod>${xmlEscape(new Date(p.updatedAt).toISOString())}</lastmod>`
      : "";

    return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmod}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

exports.generateSitemap = async (req, res, next) => {
  try {
    // 1. Static Pages
    const staticPaths = [
      "/",
      "/qmatic-orchestra",
      "/janji-temu",
      "/perencanaan-sumber-daya",
      "/mobile-ticket",
      "/umpan-balik",
      "/business-intelligence",
      "/pesan-otomatis",
      "/keamanan-sistem",
      "/kios-layanan-mandiri",
      "/tampilan-papan-informasi-digital",
      "/pengumuman-suara-otomatis",
      "/dukungan-perangkat-lunak",
      "/tentang-exaque",
      "/kontak",
      "/demo",
      "/pencarian",
      "/solusi",
      "/manajemen-antrean",
      "/manajemen-perjalanan-pelanggan",
      "/manajemen-jadwal-janji-temu",
      "/antrean-virtual",
      "/rapat-virtual",
      "/manajemen-pengunjung",
      "/integrasi",
      "/salesforce",
      "/power-bi",
      "/kisah-pelanggan",
      "/blog",
      "/faq",
      "/panduan-sistem-manajemen-antrean"
    ];

    const pages = staticPaths.map(path => ({
      path,
      published: true,
      indexable: true,
      canonicalPath: path
    }));

    // 2. Dynamic Articles (Blog)
    const articles = await Article.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'updatedAt']
    });

    articles.forEach(article => {
      pages.push({
        path: `/blog/${article.slug}`,
        updatedAt: article.updatedAt,
        published: true,
        indexable: true,
        canonicalPath: `/blog/${article.slug}`
      });
    });

    // 3. Dynamic Stories (Kisah Pelanggan)
    const stories = await Story.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'updatedAt']
    });

    stories.forEach(story => {
      pages.push({
        path: `/kisah-pelanggan/${story.slug}`,
        updatedAt: story.updatedAt,
        published: true,
        indexable: true,
        canonicalPath: `/kisah-pelanggan/${story.slug}`
      });
    });

    // Render XML
    const xml = renderSitemap(pages);

    res
      .status(200)
      .type("application/xml")
      .send(xml);

  } catch (err) {
    console.error("Error generating sitemap:", err);
    next(err);
  }
};

function renderRss(pages) {
  const seen = new Set();

  const valid = pages
    .filter((p) => p && p.published === true && p.indexable === true)
    .map((p) => ({
      ...p,
      path: normalizePath(p.path),
      canonicalPath: normalizePath(p.canonicalPath || p.path),
    }))
    .filter((p) => p.path === p.canonicalPath)
    .filter((p) => {
      if (seen.has(p.path)) return false;
      seen.add(p.path);
      return true;
    });

  const items = valid.map((p) => {
    const loc = `${BASE_URL}${p.path === "/" ? "/" : p.path}`;
    const pubDate = new Date(p.updatedAt || Date.now()).toUTCString();
    
    return `    <item>
      <guid><![CDATA[${loc}]]></guid>
      <link><![CDATA[${loc}]]></link>
      <title><![CDATA[${p.title || 'Exaque Page'}]]></title>
      <pubDate><![CDATA[${pubDate}]]></pubDate>
    </item>`;
  });

  const lastBuildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss-style.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Exaque]]></title>
    <link><![CDATA[${BASE_URL}]]></link>
    <description><![CDATA[Sitemap Exaque]]></description>
    <lastBuildDate><![CDATA[${lastBuildDate}]]></lastBuildDate>
    <atom:link href="${BASE_URL}/sitemap.rss" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;
}

exports.generateRssSitemap = async (req, res, next) => {
  try {
    // 1. Static Pages
    const staticPaths = [
      "/",
      "/qmatic-orchestra",
      "/janji-temu",
      "/perencanaan-sumber-daya",
      "/mobile-ticket",
      "/umpan-balik",
      "/business-intelligence",
      "/pesan-otomatis",
      "/keamanan-sistem",
      "/kios-layanan-mandiri",
      "/tampilan-papan-informasi-digital",
      "/pengumuman-suara-otomatis",
      "/dukungan-perangkat-lunak",
      "/tentang-exaque",
      "/kontak",
      "/demo",
      "/pencarian",
      "/solusi",
      "/manajemen-antrean",
      "/manajemen-perjalanan-pelanggan",
      "/manajemen-jadwal-janji-temu",
      "/antrean-virtual",
      "/rapat-virtual",
      "/manajemen-pengunjung",
      "/integrasi",
      "/salesforce",
      "/power-bi",
      "/kisah-pelanggan",
      "/blog",
      "/faq",
      "/panduan-sistem-manajemen-antrean"
    ];

    const pages = staticPaths.map(path => {
      let title = "Beranda";
      if (path !== "/") {
        title = path.replace(/\//g, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      return {
        path,
        title,
        published: true,
        indexable: true,
        canonicalPath: path
      };
    });

    // 2. Dynamic Articles (Blog)
    const articles = await Article.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'title', 'updatedAt']
    });

    articles.forEach(article => {
      pages.push({
        path: `/blog/${article.slug}`,
        title: article.title,
        updatedAt: article.updatedAt,
        published: true,
        indexable: true,
        canonicalPath: `/blog/${article.slug}`
      });
    });

    // 3. Dynamic Stories (Kisah Pelanggan)
    const stories = await Story.findAll({
      where: { status: 'published' },
      attributes: ['slug', 'title', 'updatedAt']
    });

    stories.forEach(story => {
      pages.push({
        path: `/kisah-pelanggan/${story.slug}`,
        title: story.title,
        updatedAt: story.updatedAt,
        published: true,
        indexable: true,
        canonicalPath: `/kisah-pelanggan/${story.slug}`
      });
    });

    // Render RSS
    const rss = renderRss(pages);

    res
      .status(200)
      .type("application/rss+xml")
      .send(rss);

  } catch (err) {
    console.error("Error generating RSS sitemap:", err);
    next(err);
  }
};
