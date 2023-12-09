import { PortfolioService } from '../services/portfolio.service'
import { IIndexRouting } from '../types/routes/IRouting'

const portfolioService = new PortfolioService()
const mainTitle = 'Tailor-made Software for the Web | Michel Wehrli'

export const routes: IIndexRouting[] = [
  {
    file: 'index.html',
    children: [
      {
        urlPart: '',
        file: 'start.html',
        meta: {
          title: `${mainTitle}`,
          description:
            "Tailored web solutions for informative sites, mobile apps, and large-scale systems. From architecture to integration, let's bring your project to life.",
          canonical: 'https://www.wehrli.me/',
        },
      },
      {
        urlPart: 'imprint',
        file: 'imprint.html',
        meta: {
          title: `Imprint | ${mainTitle}`,
          description: `Imprint of wehrli.me`,
          canonical: 'https://www.wehrli.me/imprint',
        },
      },
      {
        urlPart: 'privacy',
        file: 'privacy.html',
        meta: {
          title: `Privacy | ${mainTitle}`,
          description: 'Privacy policy of wehrli.me',
          canonical: 'https://www.wehrli.me/privacy',
        },
      },
      /*{
        urlPart: 'blog/:name',
        file: 'article.html',
        getChildUrls: () => blogService.getBlogArticleUrls('blog/:name', 'name'),
      },*/
      {
        urlPart: 'portfolio/:name',
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
