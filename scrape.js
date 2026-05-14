const { chromium } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const BASE_URL = 'https://transnetnetworks.com.br/';
const ORIGIN = new URL(BASE_URL).origin;

const TARGET_CATEGORIES = [
  'Redes',
  'Segurança eletrônica',
  'Ferramentas',
  'Elétrica',
  'Marcas'
];

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function absoluteUrl(value, base = BASE_URL) {
  if (!value || value.startsWith('data:') || value.startsWith('javascript:')) return value || '';
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function sameSite(url) {
  try {
    return new URL(url, BASE_URL).origin === ORIGIN;
  } catch {
    return false;
  }
}

function uniqBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function gotoPublic(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
}

async function extractPage(page, url, type = 'page') {
  await gotoPublic(page, url);
  const html = await page.content();
  const $ = cheerio.load(html);

  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const text = cleanText($(el).text());
    if (text) headings.push({ tag: $(el).prop('tagName').toLowerCase(), text });
  });

  const links = [];
  $('a[href]').each((_, el) => {
    const href = absoluteUrl($(el).attr('href'), url);
    const text = cleanText($(el).text()) || cleanText($(el).attr('aria-label'));
    if (href) links.push({ source: url, text, href, internal: sameSite(href) });
  });

  const images = [];
  $('img').each((_, el) => {
    const src = absoluteUrl($(el).attr('src') || $(el).attr('data-src') || '', url);
    if (src) {
      images.push({
        source: url,
        alt: cleanText($(el).attr('alt')),
        src
      });
    }
  });

  const texts = [];
  $('p, span, button, li, label, strong').each((_, el) => {
    const text = cleanText($(el).text());
    if (text && text.length > 2 && text.length < 220) texts.push(text);
  });

  return {
    url,
    type,
    title: cleanText($('title').first().text()),
    metaDescription: cleanText($('meta[name="description"]').attr('content')) || null,
    headings: uniqBy(headings, (h) => `${h.tag}:${h.text}`),
    links: uniqBy(links, (l) => l.href),
    images: uniqBy(images, (i) => i.src),
    texts: [...new Set(texts)].slice(0, 300)
  };
}

function classifyCategoryLink(link) {
  const value = `${link.text} ${link.href}`.toLowerCase();
  const categoryPathMap = {
    'Redes': '/produto_categoria/redes/',
    'Segurança eletrônica': '/produto_categoria/seguranca-eletronica/',
    'Ferramentas': '/produto_categoria/ferramentas-profissionais/',
    'Elétrica': '/produto_categoria/eletrica/',
    'Marcas': '#section-marcas'
  };
  for (const [name, pathPart] of Object.entries(categoryPathMap)) {
    if (value.includes(pathPart)) return name;
  }
  return TARGET_CATEGORIES.find((cat) => {
    const normalized = cat.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const haystack = value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    return haystack.includes(normalized);
  });
}

function extractProductsFromHtml(html, pageUrl) {
  const $ = cheerio.load(html);
  const products = [];

  const candidateSelectors = ['.tax-page', '.product', '.product-item', '.products .item'];

  $(candidateSelectors.join(',')).each((_, el) => {
    const $el = $(el);
    const productLink = $el.find('a[href*="/produto/"]').filter((_, linkEl) => {
      const text = cleanText($(linkEl).text());
      return text && !/^ver detalhes$/i.test(text);
    }).first();
    const ctaLink = $el.find('a[href*="/produto/"]').filter((_, linkEl) => /ver detalhes/i.test(cleanText($(linkEl).text()))).first();
    const link = productLink.length ? productLink : ctaLink;
    const href = absoluteUrl(link.attr('href') || '', pageUrl);
    const name =
      cleanText($el.find('h2, h3, .product-name, .name, [class*="name"], [class*="title"]').first().text()) ||
      cleanText(productLink.text());
    const image = $el.find('img').first();
    const imageSrc = absoluteUrl(image.attr('src') || image.attr('data-src') || '', pageUrl);
    const detailButton = $el.find('a, button').toArray().map((node) => cleanText($(node).text())).find((text) => /ver detalhes|detalhes/i.test(text)) || null;
    const category = cleanText($el.find('[class*="category"], [class*="categoria"]').first().text()) || null;

    if (name && href && sameSite(href) && href.includes('/produto/') && name.length < 180 && !/^\d+$/.test(name)) {
      products.push({
        name,
        category: category || (pageUrl.includes('/redes/') ? 'Redes' : null),
        url: href,
        image: imageSrc || null,
        detailButton
      });
    }
  });

  return uniqBy(products, (p) => p.url).slice(0, 80);
}

async function main() {
  await fs.ensureDir('./data');
  await fs.ensureDir('./docs');
  await fs.ensureDir('./screenshots');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const home = await extractPage(page, BASE_URL, 'home');
  await page.screenshot({ path: './screenshots/home-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 900 });
  await gotoPublic(page, BASE_URL);
  await page.screenshot({ path: './screenshots/home-mobile.png', fullPage: true });

  const categoryLinks = uniqBy(
    home.links
      .map((link) => ({ ...link, category: classifyCategoryLink(link) }))
      .filter((link) => link.category),
    (link) => link.category
  );

  const allPages = [home];
  const categories = TARGET_CATEGORIES.map((name) => {
    const link = categoryLinks.find((item) => item.category === name);
    return {
      name,
      url: link ? link.href : null,
      observedInMenu: Boolean(link)
    };
  });

  const categoryUrl = categories.find((cat) => cat.url)?.url || home.links.find((l) => /categoria|produtos|redes/i.test(`${l.text} ${l.href}`))?.href || BASE_URL;
  await page.setViewportSize({ width: 1440, height: 1200 });
  const categoryPage = await extractPage(page, categoryUrl, 'category');
  allPages.push(categoryPage);
  await page.screenshot({ path: './screenshots/categorias-desktop.png', fullPage: true });

  const html = await page.content();
  let products = extractProductsFromHtml(html, categoryUrl);

  if (products.length < 3) {
    const productLikeLinks = uniqBy(
      [...home.links, ...categoryPage.links].filter((link) => /produto|product|p\//i.test(link.href) && link.text),
      (link) => link.href
    ).slice(0, 30);
    products = productLikeLinks.map((link) => ({
      name: link.text,
      category: null,
      url: link.href,
      image: null,
      detailButton: null
    }));
  }

  let productPage = null;
  const productUrl = products.find((product) => product.url)?.url || categoryPage.links.find((link) => /produto|product/i.test(link.href))?.href;
  if (productUrl) {
    productPage = await extractPage(page, productUrl, 'product');
    allPages.push(productPage);
    await page.screenshot({ path: './screenshots/produto-desktop.png', fullPage: true });
  } else {
    await fs.copy('./screenshots/categorias-desktop.png', './screenshots/produto-desktop.png');
  }

  const pages = uniqBy(allPages, (item) => item.url);
  const links = uniqBy(pages.flatMap((item) => item.links), (item) => `${item.source}:${item.href}`);
  const images = uniqBy(pages.flatMap((item) => item.images), (item) => item.src);

  await fs.writeJson('./data/pages.json', pages, { spaces: 2 });
  await fs.writeJson('./data/links.json', links, { spaces: 2 });
  await fs.writeJson('./data/images.json', images, { spaces: 2 });
  await fs.writeJson('./data/products.json', products, { spaces: 2 });
  await fs.writeJson('./data/categories.json', categories, { spaces: 2 });

  await browser.close();
  console.log(`Auditoria gerada: ${pages.length} paginas, ${links.length} links, ${images.length} imagens, ${products.length} produtos.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
