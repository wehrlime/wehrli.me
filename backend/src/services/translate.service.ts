export enum ELanguage {
  EN = 'en',
  DE = 'de',
}

const regexes = {
  [ELanguage.DE]: /<!-- lang:de -->(.|\s|\S)*?<!-- \/lang:de -->/g,
  [ELanguage.EN]: /<!-- lang:en -->(.|\s|\S)*?<!-- \/lang:en -->/g,
}

export class TranslateService {
  translate(html: string, targetLanguage: ELanguage): string {
    const otherLanguages = Object.values(ELanguage).filter(
      (language) => language !== targetLanguage
    )
    otherLanguages.forEach((otherLanguage) => (html = html.replace(regexes[otherLanguage], '')))
    return html
      .replaceAll(`<!-- lang:${targetLanguage} -->`, '')
      .replaceAll(`<!-- /lang:${targetLanguage} -->`, '')
  }
}
