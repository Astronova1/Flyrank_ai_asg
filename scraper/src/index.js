import { discoverBooks } from './discover.js';

async function main() {
  const { books, pages } = await discoverBooks();

  console.log(`catalogue_pages=${pages.length}`);
  console.log(`discovered=${books.size}`);
  console.log(`unique_urls=${books.size}`);
}

main().catch(err => {
  console.error('Run failed:', err.message);
  process.exit(1);
})