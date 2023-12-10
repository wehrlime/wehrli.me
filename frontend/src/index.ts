import { HeaderService } from './script/header.service'
import { NavigationService } from './script/navigation.service'

// only load on the start page
if (['/', '/de', '/en'].some((match) => location.pathname.includes(match))) {
  new NavigationService()
}
new HeaderService()
