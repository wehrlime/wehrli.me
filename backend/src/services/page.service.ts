import { Express, Request, Response } from 'express'
import * as fs from 'fs'
import { flatten } from 'lodash'
import mime from 'mime'
import { PROTOCOL_AND_DOMAIN } from '..'
import { routes } from '../data/routing'
import { IRouting } from '../types/routes/IRouting'
import { SiteGenerator } from './site.generator'

export const DATA_ROOT = '../../root'
const PAGE_ROOT = DATA_ROOT + '/pages'

export class PageService {
  private readonly changeDates = new Map<string, Date>()
  private readonly htmlCache = new Map<string, string>()

  constructor(app: Express) {
    routes.forEach((indexRoute) => {
      flatten(
        indexRoute.children
          ?.filter((child) => !child.is404Page)
          ?.map((child) => this.getPaths(child))
      )?.forEach((route) => {
        app.get(route.urlPath, (req: Request, res: Response) => {
          // check if any of the route files changed
          let fileChanged = false
          route.filePaths.forEach((filePath) => {
            if (fileChanged) {
              return
            }
            if (!this.changeDates.has(PAGE_ROOT + '/' + filePath)) {
              fileChanged = true
            } else {
              fileChanged =
                fs.statSync(PAGE_ROOT + '/' + filePath).mtime.getTime() >
                this.changeDates.get(PAGE_ROOT + '/' + filePath).getTime()
            }
          })

          if (!req.query.skipCache && this.htmlCache.has(req.url) && !fileChanged) {
            res.status(200)
            res.send(this.htmlCache.get(req.url))
            return
          }

          const siteGenerator = new SiteGenerator(indexRoute.file)

          let status = 200
          let error = new Error()
          let html = siteGenerator.getHTML()

          try {
            route.filePaths.forEach((filePath) => {
              this.changeDates.set(
                PAGE_ROOT + '/' + filePath,
                fs.statSync(PAGE_ROOT + '/' + filePath).mtime
              )
              const completeFilePath = PAGE_ROOT + '/' + filePath

              if (fs.existsSync(completeFilePath)) {
                html = siteGenerator.getRouteHTML(html, completeFilePath)
              } else {
                error = new Error(`Could not find a part of this route. (${completeFilePath})`)
                status = 500
              }
            })
          } catch (err) {
            status = 500
            error =
              err instanceof Error
                ? err
                : typeof err === 'string'
                ? new Error(err)
                : new Error('An unknown Error happened')
          }

          if (status === 200) {
            res.contentType('text/html')
            res.status(200)

            html = siteGenerator.finalize(html, route.routing, req)
            this.htmlCache.set(req.url, html)

            try {
              res.send(html)
            } catch (e) {
              res.status(404)
              res.send(this.getNotFoundHtml(indexRoute))
            }
          } else {
            res.status(status)
            res.contentType('text/plain')
            if (error) {
              res.send(error.stack)
            } else {
              res.send()
            }
          }
        })
      })

      app.get(['/sitemap.xml'], (req: Request, res: Response) => {
        const urls: string[] = []

        routes.map((indexRoute) =>
          indexRoute.children
            ?.filter((child) => !child.is404Page)
            ?.map((child) =>
              this.getPaths(child).forEach((route) => {
                if (route.routing?.getChildUrls) {
                  route.routing
                    .getChildUrls()
                    .forEach((url) =>
                      urls.push(`<url><loc>${PROTOCOL_AND_DOMAIN}${url}</loc></url>`)
                    )
                } else {
                  urls.push(`<url><loc>${PROTOCOL_AND_DOMAIN}${route.urlPath}</loc></url>`)
                }
              })
            )
        )

        res.status(200)
        res.contentType('application/xml')
        res.send(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join(
            ''
          )}</urlset>`
        )
      })

      app.get(['*', '/res/*'], (req: Request, res: Response) => {
        const splitted = req.url.split('/')
        const fileName = splitted[splitted.length - 1]
        const path = req.url.replace(fileName, '')
        const filePath = `${DATA_ROOT}/${path}/${fileName}`
        const type = mime.getType(filePath) || 'text/plain'

        this.setCachingHeaders(res, type)

        try {
          res.status(200)
          res.contentType(type)
          const data = fs.readFileSync(filePath)
          res.send(data)
        } catch (err) {
          res.status(404)
          if (mime.getType(req.url)) {
            res.end()
          } else {
            res.contentType('text/html')
            res.send(this.getNotFoundHtml(indexRoute))
          }
        }
      })
    })
  }

  private getPaths(routing: IRouting, prevUrlPath = '', filePaths: string[] = []): Route[] {
    let routes: Route[] = []
    let urlPath = (prevUrlPath += `/${routing.urlPart}`)

    if (routing.file) {
      filePaths.push(routing.file)
    }

    if (routing.children?.length) {
      routing.children.forEach((child) => routes.push(...this.getPaths(child, urlPath, filePaths)))
    } else {
      // if we are here, we travelled the entire route path to the last child,
      // so we push the route and go on
      routes.push({ urlPath, filePaths, routing })
    }

    return routes
  }

  private setCachingHeaders(res: Response, type: string): void {
    let maxAge = 4 * 24 * 60 * 60

    if (type.includes('image') || type.includes('font')) {
      maxAge = 90 * 24 * 60 * 60
    } else if (type.includes('application')) {
      maxAge = 10 * 24 * 60 * 60
    }

    res.setHeader('Cache-control', `public, max-age=${maxAge}`)
  }

  private getNotFoundHtml(indexRoute: IRouting): string {
    const notFoundRoute = indexRoute.children.find((child) => child.is404Page)
    const tempSiteGenerator = new SiteGenerator(indexRoute.file)
    return tempSiteGenerator.getRouteHTML(
      tempSiteGenerator.getHTML(),
      PAGE_ROOT + '/' + notFoundRoute.file
    )
  }
}

interface Route {
  urlPath: string
  filePaths: string[]
  routing: IRouting
}
