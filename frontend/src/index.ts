import { HeaderService } from './script/header.service'
import { NavigationService } from './script/navigation.service'

// only load on the start page
const url = new URL(location.href)
if (url.pathname === '/') {
  new NavigationService()
}
new HeaderService()
