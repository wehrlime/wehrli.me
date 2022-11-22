import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import https from 'https'
import { PageService } from './services/page.service'

export const PROTOCOL_AND_DOMAIN = 'https://www.wehrli.me'
export const TITLE_POSTFIX = ' | Spezialsoftware fürs Internet | Michel Wehrli'

dotenv.config({ path: '../.env' })

const port = 3370

const key = fs.readFileSync(
  process.env.MODE === 'DEV' ? process.env.DEV_SSL_KEY : process.env.PROD_SSL_KEY,
  'utf8'
)
const cert = fs.readFileSync(
  process.env.MODE === 'DEV' ? process.env.DEV_SSL_CERT : process.env.PROD_SSL_CERT,
  'utf8'
)

const app = express()
const httpsServer = https.createServer({ key, cert }, app)

new PageService(app)

httpsServer.listen(port)
