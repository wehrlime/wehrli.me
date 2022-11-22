import express from 'express'
import fs from 'fs'
import https from 'https'
import { PageService } from './services/page.service'

export const PROTOCOL_AND_DOMAIN = 'https://www.wehrli.me'
export const TITLE_POSTFIX = ' | Spezialsoftware fürs Internet | Michel Wehrli'

const port = 3370

const key = fs.readFileSync('../../nginx/local/ssl/privkey15.pem', 'utf8')
const cert = fs.readFileSync('../../nginx/local/ssl/fullchain15.pem', 'utf8')

const app = express()
const httpsServer = https.createServer({ key, cert }, app)

new PageService(app)

httpsServer.listen(port)
