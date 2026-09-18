import * as cheerio from 'cheerio';
import { fetchPageAndCache } from './fetch.js';

const START_URL = 'https://books.toscrape.com/';
const MAX_PAGES = 3;

export async function discoverBooks() {
  const books = new Map();
  const pages = [];
  let currentUrl = START_URL;

  for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
    const { html, cacheHit } = await fetchPageAndCache(currentUrl);
    const $ = cheerio.load(html);

    $('article.product_pod h3 a').each((_, el) => {
      const href = $(el).attr('href');
      const absolute = new URL(href, currentUrl).href;
      if (!books.has(absolute)) {
        books.set(absolute, currentUrl);
      }
    });

    pages.push({ url: currentUrl, cacheHit });

    const nextHref = $('li.next a').attr('href');
    if (!nextHref) break;
    currentUrl = new URL(nextHref, currentUrl).href;
  }

  return { books, pages };
}