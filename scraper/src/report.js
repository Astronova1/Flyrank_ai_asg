import { writeFile } from 'node:fs/promises';

export async function writeReport({ startTime, pagesFetched, cacheHits, valid, invalid, failed, skipped }) {
  const report = {
    start_time: new Date(startTime).toISOString(),
    duration_ms: Date.now() - startTime,
    pages_fetched: pagesFetched,
    cache_hits: cacheHits,
    valid_records: valid,
    invalid_records: invalid,
    failed_pages: failed,
    skipped_urls: skipped
  };
  await writeFile('./output/run-report.json', JSON.stringify(report, null, 2), 'utf8');
  return report;
}