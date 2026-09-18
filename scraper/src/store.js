import { mkdir, writeFile } from 'node:fs/promises';
import { BookSchema } from './schema.js';

export async function store(records) {
  await mkdir('./output', { recursive: true });

  const valid = [];
  const invalid = [];
  const seen = new Set();

  for (const record of records) {
    // Dedupe by product_url — the canonical URL.
    if (seen.has(record.product_url)) continue;
    seen.add(record.product_url);

    const result = BookSchema.safeParse(record);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({
        record,
        reason: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
      });
    }
  }

  await writeFile('./output/books.json', JSON.stringify(valid, null, 2), 'utf8');
  await writeFile('./output/errors.json', JSON.stringify(invalid, null, 2), 'utf8');

  return { valid: valid.length, invalid: invalid.length };
}