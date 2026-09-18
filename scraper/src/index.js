import { mkdir } from 'node:fs/promises';
import { discoverBooks } from './discover.js';
import { fetchPageAndCache } from './fetch.js';
import { extractBook } from './extract.js';
import { normalize } from './normalize.js';
import { store } from './store.js';
import { writeReport } from './report.js';

async function main() {
  const startTime = Date.now();
  await mkdir('./cache', { recursive: true });

  const { books } = await discoverBooks();
  const records = [];
  const skipped = [];
  let pagesFetched = 0;
  let cacheHits = 0;

  for (const [url, sourcePage] of books) {
    try {
      const { html, cacheHit } = await fetchPageAndCache(url);
      if (cacheHit) cacheHits++;
      else pagesFetched++;

      const raw = extractBook(html, url, sourcePage);
      records.push(normalize(raw));
    } catch (err) {
      console.error(`FAIL ${url} — ${err.message}`);
      skipped.push({ url, reason: err.message });
    }
  }

  const { valid, invalid } = await store(records);

  const report = await writeReport({
    startTime,
    pagesFetched,
    cacheHits,
    valid,
    invalid,
    failed: skipped.length,
    skipped
  });

  console.log(`detail_pages=${records.length}`);
  console.log(`books.json=${report.valid_records}`);
  console.log(`errors.json=${report.invalid_records}`);
  console.log(`failed_pages=${report.failed_pages}`);
  console.log(`duration_ms=${report.duration_ms}`);
}

main().catch(err => {
  console.error('Run failed:', err.message);
  process.exit(1);
});