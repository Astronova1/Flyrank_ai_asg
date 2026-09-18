import { mkdir } from 'node:fs/promises';
import { discoverBooks } from './discover.js';
import { fetchPageAndCache } from './fetch.js';
import { extractBook } from './extract.js';
import { normalize } from './normalize.js';
import { store } from './store.js';

async function main() {
  await mkdir('./cache', { recursive: true });

  const { books } = await discoverBooks();
  const records = [];

  for (const [url, sourcePage] of books) {
    try {
      const { html } = await fetchPageAndCache(url);
      const raw = extractBook(html, url, sourcePage);
      records.push(normalize(raw));
    } catch (err) {
      console.error(`SKIP ${url} — ${err.message}`);
    }
  }

  const { valid, invalid } = await store(records);

  console.log(`detail_pages=${records.length}`);
  console.log(`books.json=${valid} records`);
  console.log(`errors.json=${invalid} records`);
}

main().catch(err => {
  console.error('Run failed:', err.message);
  process.exit(1);
});