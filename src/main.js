import Skins from 'netmodular-ui'
import systemService from './api/system'
import Admin from './index'

// 获取系统信息
const system = systemService.get()

system.modules = [Admin]
system.api = { baseUrl: '' }

// 设置个时间，防止等待页面闪烁
setTimeout(() => {
  Skins.use({ system })
}, 500)
