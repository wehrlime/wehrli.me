import { Request } from 'express'
import * as fs from 'fs'
import { PROTOCOL_AND_DOMAIN } from '..'
import { IRouting } from '../types/routes/IRouting'
import { BlogService } from './blog.service'
import { DATA_ROOT } from './page.service'
import { PortfolioService } from './portfolio.service'
import { ELanguage, TranslateService } from './translate.service'

const INCLUDE_REGEX = /<include[^<>]+><\/include>/g
const ROUTE_REGEX = /<route><\/route>/g
const BLOGS_REGEX = /<blogs><\/blogs>/g
const BLOG_ARTICLE_REGEX = /<blog-article><\/blog-article>/g
const PORTFOLIO_ARTICLE_REGEX = /<portfolio-article><\/portfolio-article>/g
const TITLE_REGEX = /<title>.*<\/title>/g
const META_TITLE_REGEX = /<meta name="title" content="([^")]*)"\/>/g
const META_DESCRIPTION_REGEX = /<meta name="description" content="([^")]*)"\/>/g
const LINK_CANONICAL = /<link rel="canonical" href="([^")]*)"\/>/g
const META_ROBOTS = /<meta name="robots"\/>/g

export class SiteGenerator {
  private readonly blogService = new BlogService()
  private readonly portfolioService = new PortfolioService()
  private readonly translateService = new TranslateService()

  private readonly indexHTML: string

  constructor(private readonly indexPath: string, private readonly lang: ELanguage) {
    this.indexHTML = this.loadHTML(DATA_ROOT + '/' + this.indexPath)
  }

  loadHTML(path: string): string {
    let html = fs.readFileSync(path, 'utf8')

    const includeMatches = html.match(INCLUDE_REGEX)
    const routeMatches = html.match(ROUTE_REGEX) || []

    if (routeMatches?.length > 1) {
      throw new Error(`HTML "${path}" has multiple <page /> tags. Not allowed. Aborting.`)
    }

    includeMatches?.forEach((match) => {
      const path = match.match(/(?<=path=")(.*)(?=")/g)
      const includePath = DATA_ROOT + '/' + path

      if (fs.existsSync(includePath)) {
        const includeHTML = this.loadHTML(DATA_ROOT + '/' + path) || ''
        html = html.replace(match, includeHTML)
      } else {
        console.error(`"${includePath}" does not exist`)
      }
    })

    return html
  }

  getHTML(): string {
    return `${this.indexHTML}`
  }

  getRouteHTML(html: string, path: string): string {
    const match = html.match(ROUTE_REGEX)?.[0]
    if (match) {
      html = html.replace(match, this.loadHTML(path))
    }
    return html
  }

  finalize(html: string, route: IRouting, request: Request): string {
    const includeMatches = html.match(INCLUDE_REGEX)
    const routeMatches = html.match(ROUTE_REGEX)
    const blogsMatches = html.match(BLOGS_REGEX)
    const blogArticleMatches = html.match(BLOG_ARTICLE_REGEX)
    const portfolioArticleMatches = html.match(PORTFOLIO_ARTICLE_REGEX)

    includeMatches?.forEach((includeMatch) => (html = html.replace(includeMatch, '')))
    routeMatches?.forEach((routeMatch) => (html = html.replace(routeMatch, '')))

    let meta = route.meta

    if (blogsMatches?.length === 1) {
      html = html.replace(blogsMatches[0], this.blogService.getList())
    }

    if (blogArticleMatches?.length === 1) {
      const data = this.blogService.getData(request.params)
      meta = data.meta
      html = html.replace(blogArticleMatches[0], data.html)
    }

    if (portfolioArticleMatches?.length === 1) {
      try {
        const name = request.params['name']
        html = html.replace(portfolioArticleMatches[0], this.portfolioService.getHtml(name))
        meta = {
          title: `Portfolio Page: ${name
            .replaceAll('-', ' ')
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.substring(1))
            .join(' ')}`,
          canonical: this.portfolioService.getUrl(PROTOCOL_AND_DOMAIN, name),
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (meta) {
      if (meta?.title) {
        const titleMatch = html.match(TITLE_REGEX)?.[0]
        if (titleMatch) {
          html = html.replace(titleMatch, `<title>${meta.title}</title>`)
        }
        const metaTitleMatch = html.match(META_TITLE_REGEX)?.[0]
        if (metaTitleMatch) {
          html = html.replace(metaTitleMatch, `<meta name="title" content="${meta.title}" />`)
        }
      }
      if (meta?.description) {
        const descriptionMatch = html.match(META_DESCRIPTION_REGEX)?.[0]
        if (descriptionMatch) {
          html = html.replace(
            descriptionMatch,
            `<meta name="description" content="${meta.description}" />`
          )
        }
      }
      if (meta?.canonical) {
        const canonicalMatch = html.match(LINK_CANONICAL)?.[0]
        if (canonicalMatch) {
          html = html.replace(canonicalMatch, `<link rel="canonical" href="${meta.canonical}" />`)
        }
      }

      const robotsMatch = html.match(META_ROBOTS)?.[0]
      if (robotsMatch) {
        html = html.replace(
          robotsMatch,
          `<meta name="robots" content="${meta?.noIndex ? 'noindex' : 'index'}">`
        )
      }
    }

    return this.translateService.translate(html, this.lang)
  }
}
