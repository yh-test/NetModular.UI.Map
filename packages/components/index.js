let components = []
const requireComponent = require.context('../components', true, /index\.(vue|js)$/)
requireComponent
  .keys()
  .filter(item => item !== './index.js')
  .forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    if (componentConfig.default && componentConfig.default.name) {
      components.push(componentConfig.default)
    }
  })
export default function(Vue, options) {
  //扩展属性
  Vue.prototype.$map = options

  components.forEach(component => {
    Vue.component(`Nm${component.name}`, component)
  })
}
