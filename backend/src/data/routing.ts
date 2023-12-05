import { BlogService } from '../services/blog.service'
import { IIndexRouting } from '../types/routes/IRouting'

const blogService = new BlogService()
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
            'Michel Wehrli konzipiert und entwickelt massgeschneiderte Verwaltungssysteme, Websites und mobile Apps und verbindet diese Teilsysteme zu einem funktionierenden Ganzen.',
          canonical: 'https://www.wehrli.me/',
        },
      },
      {
        urlPart: 'imprint',
        file: 'imprint.html',
        meta: {
          title: `Imprint | ${mainTitle}`,
          description: 'Das Impressum von wehrli.me.',
          canonical: 'https://www.wehrli.me/imprint',
        },
      },
      {
        urlPart: 'privacy',
        file: 'privacy.html',
        meta: {
          title: `Privacy | ${mainTitle}`,
          description: 'Die Datenschutzrichtlinien von wehrli.me.',
          canonical: 'https://www.wehrli.me/privacy',
        },
      },
      /*{
        urlPart: 'blog/:name',
        file: 'article.html',
        getChildUrls: () => blogService.getBlogArticleUrls('blog/:name', 'name'),
      },*/
      {
        is404Page: true,
        file: '404.html',
      },
    ],
  },
]
