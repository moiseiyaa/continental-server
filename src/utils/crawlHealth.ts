import axios from 'axios'
import cheerio from 'cheerio'
import SeoMetadata from '../models/seoMetadata.model'
import CrawlIssue from '../models/crawlIssue.model'

export default async function scan() {
  const metas = await SeoMetadata.findAll()
  for (const meta of metas) {
    try {
      const url = `https://continentaltravels.com${meta.path}`
      const { data: html } = await axios.get(url, { timeout: 10000 })
      const $ = cheerio.load(html)

      if ($('h1').length === 0) {
        await CrawlIssue.insert(meta.path, 'MISSING_H1', 'No H1 tag found')
      }

      const links = $('a[href^="/"]').map((_, el)=>$(el).attr('href')).get()
      for (const link of links) {
        try {
          const res = await axios.head(`https://continentaltravels.com${link}`, { timeout: 5000 })
          if (res.status >= 400) {
            await CrawlIssue.insert(meta.path, 'BROKEN_LINK', link)
          }
        } catch {
          await CrawlIssue.insert(meta.path, 'BROKEN_LINK', link)
        }
      }
    } catch (err) {
      console.error('crawl error', meta.path)
    }
  }
}
