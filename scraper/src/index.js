import { mkdir } from 'node:fs/promises';
import { discoverBooks } from './discover.js';
import { fetchPageAndCache } from './fetch.js';
import { extractBook } from './extract.js';

async function main() {
  await mkdir('./cache', { recursive: true });

  const { books } = await discoverBooks();
  const records = [];

  for (const [url, sourcePage] of books) {
    try {
      const { html } = await fetchPageAndCache(url);
      const record = extractBook(html, url, sourcePage);
      records.push(record);
    } catch (err) {
      console.error(`SKIP ${url} — ${err.message}`);
    }
  }

  console.log(`detail_pages=${records.length}`);
  console.log(JSON.stringify(records[0], null, 2));
}

main().catch(err => {
  console.error('Run failed:', err.message);
  process.exit(1);
});