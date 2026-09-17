import { fetchPageAndCache } from "./fetch.js";
import { mkdir } from "node:fs/promises";

const URL = 'https://books.toscrape.com/'
const cachePath = './cache/catelogpage1.html'

async function main(){
    await mkdir('cache', {recursive: true})

    const {html, cacheHit} = await fetchPageAndCache(URL,cachePath)

    const status = cacheHit? 'CacheHit' : 'CacheMiss'
    console.log(`${status} -${URL}`)
    console.log(`saved to ${cachePath}`)
    console.log(`size: ${html.length} bytes`);
}

    main().catch(err => {
    console.error('Run failed:', err.message);
    process.exit(1);
    }); 