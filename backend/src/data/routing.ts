import { BlogService } from '../services/blog.service'
import { IIndexRouting } from '../types/routes/IRouting'

const blogService = new BlogService()

export const routes: IIndexRouting[] = [
  {
    file: 'index.html',
    children: [
      {
        urlPart: '',
        file: 'start.html',
        meta: {
          title: 'Spezialsoftware fürs Internet | Michel Wehrli',
          description:
            'Michel Wehrli konzipiert und entwickelt massgeschneiderte Verwaltungssysteme, Websites und mobile Apps und verbindet diese Teilsysteme zu einem funktionierenden Ganzen.',
          canonical: 'https://www.wehrli.me/',
        },
      },
      {
        urlPart: 'impressum',
        file: 'imprint.html',
        meta: {
          title: 'Impressum | Spezialsoftware fürs Internet | Michel Wehrli',
          description: 'Das Impressum von wehrli.me.',
          canonical: 'https://www.wehrli.me/impressum',
        },
      },
      {
        urlPart: 'datenschutz',
        file: 'privacy.html',
        meta: {
          title: 'Datenschutz | Spezialsoftware fürs Internet | Michel Wehrli',
          description: 'Die Datenschutzrichtlinien von wehrli.me.',
          canonical: 'https://www.wehrli.me/datenschutz',
        },
      },
      {
        urlPart: 'blog',
        file: 'blog.html',
        meta: {
          title: 'Blog | Spezialsoftware fürs Internet | Michel Wehrli',
          description:
            'Hier lesen Sie meine neusten Blogbeiträge rund ums Thema Webentwicklung und Internet.',
          canonical: 'https://www.wehrli.me/blog',
        },
      },
      {
        urlPart: 'blog/:name',
        file: 'article.html',
        getChildUrls: () => blogService.getBlogArticleUrls('blog/:name', 'name'),
      },
      {
        is404Page: true,
        file: '404.html',
      },
    ],
  },
]
