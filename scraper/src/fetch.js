import fs from 'node:fs/promises'

const userAgent = 'Flyrank internshipt project'
const timeInterval = 20_000

export async function fetchPageAndCache(url, cachepath){
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
        throw Error(`${response.Error} for url${URL}`)
    }

    const html = await response.text()

    await fs.writeFile(cachepath,html, 'utf8')
    return {html, cacheHit: false}
}