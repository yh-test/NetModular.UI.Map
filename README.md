# NetModular-UI-Map

NetModular 前端地图组件库，基于百度地图+ElementUI，本项目依赖于 [NetModular.UI](https://github.com/iamoldli/NetModular.UI) 库

## 文档说明

[https://nm.iamoldli.com/docs/ui/](https://nm.iamoldli.com/docs/ui/)

## 安装

```
npm install -S netmodular-ui-map
```

## 注册

在模块的 callback 函数中进行注册，已 [NetModular.Module.Common](https://github.com/iamoldli/NetModular.Module.Common) 模块为例

```js
import './api'
import store from './store'
import routes from './routes'
import components from './components'
import module from './module'

export default {
  module,
  routes,
  store,
  components,
  callback({ Vue }) {
    // 附件上传地址
    Vue.prototype.$attachment = {
      // 上传地址
      uploadUrl: $api.common.attachment.getUploadUrl(),
      // 下载方法
      download(id) {
        $api.common.attachment.download(id)
      }
    }
  },
  callback({ Vue }) {
    NetModularMap.init(Vue, { ak: '百度地图Key' })
  }
}
```

## 坐标拾取组件

```html
<nm-form-page v-bind="form">
  <el-row>
    <el-col :span="10" :offset="1">
      <el-form-item label="坐标：" prop="point">
        <nm-map-coord-picking v-model="form.model.point" />
      </el-form-item>
      <el-form-item label="允许手动输入坐标：" prop="point">
        <nm-map-coord-picking v-model="form.model.point1" allow-input />
      </el-form-item>
      <el-form-item label="禁用：" prop="point">
        <nm-map-coord-picking v-model="form.model.point1" disabled />
      </el-form-item>
      <el-form-item label="设置精度：" prop="point">
        <nm-map-coord-picking v-model="form.model.point2" :precision="8" />
      </el-form-item>
    </el-col>
  </el-row>
</nm-form-page>
```

演示 Demo [https://nm.iamoldli.com/docs/ui/#/components/map-coord-picking/demo1](https://nm.iamoldli.com/docs/ui/#/components/map-coord-picking/demo1)
