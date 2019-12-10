import './styles/_index.scss'
import MapComponents from './components'

export default {
  init(Vue, options) {
    Vue.use(MapComponents, options)
  }
}
