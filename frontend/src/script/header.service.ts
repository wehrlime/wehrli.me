export class HeaderService {
  private readonly headerE: HTMLHeadElement

  constructor() {
    this.headerE = document.querySelector('header')

    window.addEventListener('load', () => this.handleScroll())
    window.addEventListener('scroll', () => this.handleScroll())
  }

  private handleScroll() {
    if (document.documentElement.scrollTop > 0) {
      this.headerE.classList.remove('header--large')
      this.headerE.classList.add('header--small')
    } else {
      this.headerE.classList.remove('header--small')
      this.headerE.classList.add('header--large')
    }
  }
}
