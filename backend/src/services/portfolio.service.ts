import fs from 'fs'
import { cwd } from 'process'

const REFERENCE_BASE_URL = '..\\..\\root\\pages\\portfolio\\'

export class PortfolioService {
  getHtml(name: string): string {
    return fs.readFileSync(`${REFERENCE_BASE_URL}${name}.html`, 'utf-8')
  }

  getUrl(base: string, name: string): string {
    return `${base}/portfolio/${name}`
  }

  getUrls(base: string, name: string): string[] {
    return this.load().map((url) => `/${base.replace(`:${name}`, url)}`)
  }

  private load(visibleOnly = true): string[] {
    return this.getAllFiles(REFERENCE_BASE_URL)
  }

  private getAllFiles(dir: string): string[] {
    return fs
      .readdirSync(`${cwd()}\\${dir}`)
      .filter((fileName) => fileName !== 'index.html')
      .filter((fileName) => fileName.endsWith('.html'))
      .map((fileName) => fileName.replace('.html', ''))
  }
}
