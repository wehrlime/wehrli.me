export class NavigationService {
  private readonly POSSIBLE_PAGES = ['default', 'impressum', 'datenschutz']

  private readonly navE: HTMLDivElement
  private readonly navItemEs: NodeListOf<HTMLAnchorElement>
  private readonly anchorEs: NodeListOf<HTMLAnchorElement>

  constructor() {
    this.navE = document.querySelector('.header__inner__nav')
    this.navItemEs = this.navE.querySelectorAll('.header__inner__nav__item')
    this.anchorEs = document.querySelectorAll('a[name]')

    window.addEventListener('load', () => this.handleFragment())
    this.navItemEs.forEach((anchorE) =>
      anchorE.addEventListener('click', () => setTimeout(() => this.handleFragment(), 0))
    )

    window.addEventListener('scroll', () => this.handleNearestAnchor())

    const domain = `${location.protocol}//${location.host}`
    let page = location.href.split(`${domain}/`)[1]
    if (page && !this.POSSIBLE_PAGES.includes(page)) {
      location.href = domain
    }
    if (!page || page.startsWith('#')) {
      page = 'default'
    }

    const pageEs = document.querySelectorAll(`[data-page="${page}"]`)
    pageEs.forEach((pageE) => pageE.classList.add('page--visible'))
  }

  private handleFragment(hashOverride?: string): void {
    const hash = hashOverride || location.hash
    this.navE
      .querySelectorAll('a')
      .forEach((anchor) => anchor.classList.remove('header__inner__nav__item--active'))
    if (hash) {
      this.navE
        .querySelector<HTMLAnchorElement>(`[href="${hash}"]`)
        .classList.add('header__inner__nav__item--active')
    }
  }

  private handleNearestAnchor(): void {
    let currentOffsetTop = Infinity
    let nearestAnchorE: HTMLAnchorElement
    const currentScrollTop = document.documentElement.scrollTop
    this.anchorEs.forEach((anchorE) => {
      const offsetTop = anchorE.offsetTop
      if (offsetTop < currentScrollTop + 10) {
        currentOffsetTop = offsetTop
        nearestAnchorE = anchorE
      }
    })
    if (nearestAnchorE) {
      const name = `#${nearestAnchorE.getAttribute('name')}`
      this.handleFragment(name)
      if (nearestAnchorE.getAttribute('name') !== 'start') {
        history.replaceState(null, null, location.href.split('#')[0] + name)
      } else {
        history.replaceState(null, null, location.href.split('#')[0])
      }
    } else {
      this.navE
        .querySelectorAll('a')
        .forEach((anchor) => anchor.classList.remove('header__inner__nav__item--active'))
    }
  }
}
