import { ELanguage } from '../../services/translate.service'

export interface IIndexRouting {
  file: string
  children?: IRouting[]
}

export interface IRouting {
  is404Page?: boolean
  file?: string
  urlPart?: string
  children?: IRouting[]
  meta?: IMeta
  getChildUrls?: () => string[]
  redirect?: string
}

export interface IMeta {
  title: {
    [ELanguage.DE]: string
    [ELanguage.EN]: string
  }
  description?: {
    [ELanguage.DE]: string
    [ELanguage.EN]: string
  }
  canonical?: string
  noIndex?: boolean
}
