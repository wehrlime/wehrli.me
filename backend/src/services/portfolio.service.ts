import fs from 'fs'
import { cwd } from 'process'
import { ELanguage } from './translate.service'

const REFERENCE_BASE_URLS = {
  DEV: '\\..\\..\\root\\pages\\portfolio\\',
  PROD: '/../../root/pages/portfolio/',
}

export class PortfolioService {
  getHtml(name: string): string {
    return fs.readFileSync(`${cwd()}${REFERENCE_BASE_URLS[process.env.MODE]}${name}.html`, 'utf-8')
  }

  getUrl(base: string, name: string, language: ELanguage): string {
    return `${base}/${language}/portfolio/${name}/`
  }

  getUrls(base: string, name: string): string[] {
    return this.load().flatMap((url) =>
      Object.values(ELanguage).map((language) => `/${language}/${base.replace(`:${name}`, url)}/`)
    )
  }

  private load(): string[] {
    return this.getAllFiles(REFERENCE_BASE_URLS[process.env.MODE])
  }

  private getAllFiles(dir: string): string[] {
    return fs
      .readdirSync(`${cwd()}${dir}`)
      .filter((fileName) => fileName !== 'index.html')
      .filter((fileName) => fileName.endsWith('.html'))
      .map((fileName) => fileName.replace('.html', ''))
  }
}
