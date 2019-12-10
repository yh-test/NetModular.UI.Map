import routes from './routes'
import login from 'netmodular-ui/src/views/login'
import NmMap from '../packages/components'
export default {
  module: {
    name: 'nm-module-map',
    code: 'admin',
    version: '1.0.0',
    description: '地图'
  },
  routes,
  components: [
    {
      name: 'nm-login-auto',
      component: login
    }
  ],
  callback({ Vue }) {
    NmMap.init(Vue, { ak: 'q96f4kWdHsVg1Y8tlclqYvrlpdnhlz5l' })
  }
}
