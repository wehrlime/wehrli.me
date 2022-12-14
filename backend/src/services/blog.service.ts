import fs from 'fs'
import MarkdownIt from 'markdown-it'
import { PROTOCOL_AND_DOMAIN, TITLE_POSTFIX } from '..'
import { IMeta } from '../types/routes/IRouting'

const FILLER_POSITION = 4
const BLOG_ARTICLE_JSON_PATH = '../data/blog/'
const BLOG_BASE_URL = '/blog/'

export class BlogService {
  private readonly markdowner = new MarkdownIt({
    html: true,
  })

  getBlogData(params: any): { meta: IMeta; html: string } {
    const articles = this.loadArticles()

    const blogName = params.name
    const blogId = blogName.split('-')[0]

    const article = articles.find((article) => article.id === parseInt(blogId))

    return {
      meta: {
        title: article.title + TITLE_POSTFIX,
        description: article.teaser,
        canonical: this.getArticleUrl(article),
      },
      html: this.generateArticleHtml(blogId, article),
    }
  }

  getBlogList(): string {
    let html = ''

    const articles = this.loadArticles()
    articles.forEach((article, index) => {
      if (index === FILLER_POSITION) {
        html += this.getFillerEntryHTML()
      }
      html += this.generateEntryHtml(article)
    })

    if (articles.length <= FILLER_POSITION) {
      html += this.getFillerEntryHTML()
    }

    return html
  }

  getBlogArticleUrls(base: string, paramName: string): string[] {
    const urls: string[] = []
    this.loadArticles().forEach((article) =>
      urls.push(`/${base.replace(`:${paramName}`, this.getBlogName(article))}`)
    )
    return urls
  }

  private getArticleUrl(article: IArticle): string {
    return `${PROTOCOL_AND_DOMAIN}${BLOG_BASE_URL}${this.getBlogName(article)}`
  }

  private loadArticles(visibleOnly = true): IArticle[] {
    return (
      JSON.parse(fs.readFileSync(`${BLOG_ARTICLE_JSON_PATH}/blogs.json`, 'utf-8')) as IArticle[]
    ).filter((article) => (visibleOnly ? article.visible : true))
  }

  private generateArticleHtml(id: string, article: IArticle): string {
    let renderedMarkdown: string
    try {
      renderedMarkdown = this.markdowner.render(
        fs.readFileSync(`${BLOG_ARTICLE_JSON_PATH}articles/${id}.md`, 'utf-8')
      )
    } catch (e) {}

    const html = `
      ${
        article?.image?.src?.startsWith('/')
          ? `<article class="article article--standalone article--blog"><img src="${article.image.src}" alt="${article.image.alt}" /></article>`
          : ''
      }
      <article class="article article--standalone article--blog article--max-width-2">
        <p><a href="${BLOG_BASE_URL}">Zur??ck zur ??bersicht</a></p>
        <h1>${article.title}</h1>
        ${renderedMarkdown || ''}
      </article>`

    return html.replace(/(\r\n|\n|\r)/gm, '')
  }

  private generateEntryHtml(article: IArticle): string {
    return `
      <a
        href="${BLOG_BASE_URL}${this.getBlogName(article)}"
        class="blogs__blog"
      >
        <img
          src="${article.image.src}"
          alt="${article.image.alt}"
          loading="lazy"
        />
        <p class="blogs__blog__title">${article.title}</p>
        <p class="blogs__blog__teaser">${article.teaser}</p>
        <p class="blogs__blog__link"><span>Lesen</span></p>
      </a>
    `
  }

  private getFillerEntryHTML(): string {
    return `
      <div class="blogs__blog blogs__blog--not-found">
        <p class="blogs__blog__title">Nicht gefunden<br />wonach Sie suchen?</p>
        <p class="blogs__blog__lead">
          Kontaktieren Sie mich unverbindlich f??r eine kostenlose Evaluation Ihrer Idee.
        </p>
        <p>
          <a href="mailto:hello@wehrli.me" class="button button--gradient">
            Kontakt herstellen
          </a>
        </p>
      </div>
    `
  }

  private getBlogName(article: IArticle): string {
    return `${article.id}-${article.title
      .split('??')
      .join('ae')
      .split('??')
      .join('oe')
      .split('??')
      .join('ue')
      .replace(/[\W_]+/g, ' ')
      .trim()
      .split(' ')
      .join('-')}`.toLowerCase()
  }
}

interface IArticle {
  id: number
  image: IImage
  title: string
  teaser: string
  visible: boolean
}

interface IImage {
  src: string
  alt: string
}
