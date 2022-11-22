export class HeaderService {
  private readonly headerE: HTMLHeadElement

  constructor() {
    this.headerE = document.querySelector('header')

    window.addEventListener('load', () => this.handleScroll())
    window.addEventListener('scroll', () => this.handleScroll())
  }

  private handleScroll() {
    const isScrolled = document.documentElement.scrollTop > 0
    this.headerE.classList.toggle('header--large', !isScrolled)
    this.headerE.classList.toggle('header--small', isScrolled)
  }
}
