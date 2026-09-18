import * as cheerio from 'cheerio';

export function extractBook(html, productUrl, sourcePage) {
  const $ = cheerio.load(html);
  const main = $('.product_main');

  const title = main.find('h1').text().trim();

  const priceText = main.find('.price_color').text().trim();

  const availabilityText = main.find('.availability').text().trim();

  const ratingClass = main.find('.star-rating').attr('class') || '';
  const ratingText = ratingClass.replace('star-rating', '').trim();

  const description = $('#product_description').next('p').text().trim() || null;

  return {
    title,
    product_url: productUrl,
    price_text: priceText,
    availability_text: availabilityText,
    rating_text: ratingText,
    description,
    source_page: sourcePage,
    fetched_at: new Date().toISOString()
  };
}

export function cacheSlugFromUrl(url) {
  const match = new URL(url).pathname.match(/\/([^/]+)\/index\.html$/);
  return match ? match[1] : new URL(url).pathname.replace(/\W+/g, '_');
}