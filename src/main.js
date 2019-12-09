import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NmMap from '../packages/components'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(NmMap, { ak: 'q96f4kWdHsVg1Y8tlclqYvrlpdnhlz5l' })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
