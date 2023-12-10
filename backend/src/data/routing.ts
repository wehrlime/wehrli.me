import { PortfolioService } from '../services/portfolio.service'
import { IIndexRouting } from '../types/routes/IRouting'

const portfolioService = new PortfolioService()
const mainTitle = {
  en: 'Custom web solutions | Michel Wehrli',
  de: 'Individuelle Weblösungen | Michel Wehrli',
}

export const routes: IIndexRouting[] = [
  {
    file: 'index.html',
    children: [
      {
        urlPart: '',
        file: 'start.html',
        meta: {
          title: {
            en: `${mainTitle.en}`,
            de: `${mainTitle.de}`,
          },
          description: {
            en: 'Custom web solutions: Websites, mobile apps, complex systems. From architecture to integration - your project in the best hands.',
            de: 'Individuelle Weblösungen: Websites, mobile Apps, komplexe Systeme. Von Architektur bis Integration - Ihr Projekt in besten Händen.',
          },
          canonical: 'https://www.wehrli.me/',
        },
      },
      {
        urlPart: ':lang',
        file: 'start.html',
        meta: {
          title: {
            en: `${mainTitle.en}`,
            de: `${mainTitle.de}`,
          },
          description: {
            en: 'Custom web solutions: Websites, mobile apps, complex systems. From architecture to integration - your project in the best hands.',
            de: 'Individuelle Weblösungen: Websites, mobile Apps, komplexe Systeme. Von Architektur bis Integration - Ihr Projekt in besten Händen.',
          },
          canonical: 'https://www.wehrli.me/:lang/',
        },
      },
      {
        urlPart: ':lang/imprint',
        file: 'imprint.html',
        meta: {
          title: {
            en: `Imprint | ${mainTitle.en}`,
            de: `Impressum | ${mainTitle.de}`,
          },
          description: {
            en: `Imprint of wehrli.me`,
            de: `Impressum von wehrli.me`,
          },
          canonical: 'https://www.wehrli.me/:lang/imprint/',
        },
      },
      {
        urlPart: ':lang/privacy',
        file: 'privacy.html',
        meta: {
          title: {
            en: `Privacy policy | ${mainTitle.en}`,
            de: `Datenschutz | ${mainTitle.de}`,
          },
          description: {
            en: `Privacy policy of wehrli.me`,
            de: `Datenschutz von wehrli.me`,
          },
          canonical: 'https://www.wehrli.me/:lang/privacy/',
        },
      },
      /*{
        urlPart: 'blog/:name',
        file: 'article.html',
        getChildUrls: () => blogService.getBlogArticleUrls('blog/:name', 'name'),
      },*/
      {
        urlPart: ':lang/portfolio/:name',
        file: 'portfolio/index.html',
        getChildUrls: () => portfolioService.getUrls('portfolio/:name', 'name'),
      },
      {
        is404Page: true,
        file: '404.html',
      },
    ],
  },
]
