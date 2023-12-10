import { PortfolioService } from '../services/portfolio.service'
import { IIndexRouting } from '../types/routes/IRouting'

const portfolioService = new PortfolioService()
const mainTitle = {
  en: 'Tailored Software for the Web | Michel Wehrli',
  de: 'Maßgeschneiderte Software für das Web | Michel Wehrli',
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
            en: "Tailored web solutions for informative sites, mobile apps, and large-scale systems. From architecture to integration, let's bring your project to life.",
            de: 'Maßgeschneiderte Weblösungen für informative Websites, mobile Apps und anspruchsvolle Systeme. Von der Architektur bis zur Integration, lassen Sie mich Ihr Projekt zum Leben erwecken.',
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
            en: "Tailored web solutions for informative sites, mobile apps, and large-scale systems. From architecture to integration, let's bring your project to life.",
            de: 'Maßgeschneiderte Weblösungen für informative Websites, mobile Apps und anspruchsvolle Systeme. Von der Architektur bis zur Integration, lassen Sie mich Ihr Projekt zum Leben erwecken.',
          },
          canonical: 'https://www.wehrli.me/',
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
          canonical: 'https://www.wehrli.me/imprint',
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
          canonical: 'https://www.wehrli.me/privacy',
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
