import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const userAgent = 'Flyrank internshipt project'
const timeInterval = 20_000

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY_MS = 500;

export async function fetchPageAndCache(url){

    const parseUrl = new URL(url)
    parseUrl.searchParams.sort()
    const hash = createHash('sha256').update(parseUrl.toString()).digest('hex')
    const cachepath = path.join('cache', `${hash}.html`) 

    try{
        const html = await fs.readFile(cachepath,{encoding: 'utf8'})
        return {html, cacheHit: true}
    }
    catch {
        //cache miss, create new file
    }

    const response = await fetch(url, {
        headers: { 'User-Agent': userAgent},
        signal: AbortSignal.timeout(timeInterval)
    })


    if (!response.ok){
        throw Error(`${response.status} for url${URL}`)
    }

    const html = await response.text()

    await fs.writeFile(cachepath,html, 'utf8')
    return {html, cacheHit: false}
}