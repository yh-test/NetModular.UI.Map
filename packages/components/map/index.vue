<template>
  <div ref="map" class="nm-map" :style="{ width, height }"></div>
</template>
<script>
/**默认坐标点 */
const defaultCenter = {
  lng: 116.404,
  lat: 39.915
}
export default {
  name: 'Map',
  data() {
    return {
      map: null
    }
  },
  props: {
    ak: String,
    /**宽度 */
    width: {
      type: String,
      default: '100%'
    },
    /**高度 */
    height: {
      type: String,
      default: '100%'
    },
    /**中心坐标点 */
    center: {
      type: [Object, String],
      default() {
        return {
          lng: 116.404,
          lat: 39.915
        }
      }
    },
    /**缩放 */
    zoom: {
      type: Number,
      default: 15
    },
    /**是否开启底图可点功能，默认关闭 */
    mapClick: Boolean,
    /**启用地图拖拽，默认启用 */
    dragging: {
      type: Boolean,
      default: true
    },
    /**启用滚轮放大缩小，默认启用 */
    scrollWheelZoom: {
      type: Boolean,
      default: true
    },
    /**启用双击放大，默认启用 */
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    /**启用键盘操作，默认禁用。键盘的上、下、左、右键可连续移动地图。同时按下其中两个键可使地图进行对角移动。PgUp、PgDn、Home和End键会使地图平移其1/2的大小。+、-键会使地图放大或缩小一级 */
    keyboard: {
      type: Boolean,
      default: false
    },
    /**启用地图惯性拖拽，默认禁用 */
    inertialDragging: {
      type: Boolean,
      default: false
    },
    /**启用连续缩放效果，默认禁用 */
    continuousZoom: {
      type: Boolean,
      default: false
    },
    /**启用双指操作缩放，默认启用 */
    pinchToZoom: {
      type: Boolean,
      default: true
    },
    /**启用自动适应容器尺寸变化，默认启用 */
    autoResize: {
      type: Boolean,
      default: true
    },
    /**设置地图默认的鼠标指针样式。参数cursor应符合CSS的cursor属性规范 */
    defaultCursor: String,
    /**设置拖拽地图时的鼠标指针样式。参数cursor应符合CSS的cursor属性规范 */
    draggingCursor: String,
    /**设置地图允许的最小级别。取值不得小于地图类型所允许的最小级别 */
    minZoom: Number,
    /**设置地图允许的最大级别。取值不得大于地图类型所允许的最大级别 */
    maxZoom: Number
  },
  methods: {
    /**
     * @description 创建脚本
     */
    createScript() {
      const ak = this.ak || this.$map.ak
      return new Promise(function(resolve) {
        if (window.BMap) {
          resolve(BMap)
        } else {
          window._mapInit = function() {
            resolve(BMap)
          }
          let script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = '//api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=_mapInit'
          document.head.appendChild(script)
        }
      })
    },
    /**
     * @description 初始化
     */
    init() {
      this.map = new BMap.Map(this.$refs.map, { enableMapClick: this.mapClick })
      this.setOptions()
      this.$emit('init', this.map)
    },
    /**初始设置 */
    setOptions() {
      this.centerAndZoom()

      this.setDefaultCursor()
      this.setDraggingCursor()
      this.setMinZoom()
      this.setMaxZoom()

      this.triggerDragging()
      this.triggerScrollWheelZoom()
      this.triggerDoubleClickZoom()
      this.triggerKeyboard()
      this.triggerInertialDragging()
      this.triggerContinuousZoom()
      this.triggerPinchToZoom()
      this.triggerAutoResize()
    },
    centerAndZoom() {
      let center = this.center
      if (!center) {
        center = Object.assign({}, defaultCenter)
      }
      if (typeof center === 'object') {
        const point = new BMap.Point(center.lng, center.lat)
        this.map.centerAndZoom(point, this.zoom)
      } else {
        this.map.centerAndZoom(center, this.zoom)
      }
    },
    setZoom() {
      this.map.setZoom(this.zoom)
    },
    setDefaultCursor() {
      this.defaultCursor && this.map.setDefaultCursor(this.defaultCursor)
    },
    setDraggingCursor() {
      this.draggingCursor && this.map.setDraggingCursor(this.draggingCursor)
    },
    setMinZoom() {
      this.minZoom && this.map.setMinZoom(this.minZoom)
    },
    setMaxZoom() {
      this.maxZoom && this.map.setMaxZoom(this.maxZoom)
    },
    setMapType() {
      this.map.setMapType(this.mapType)
    },
    triggerDragging() {
      this.dragging ? this.map.enableDragging() : this.map.disableDragging()
    },
    triggerScrollWheelZoom() {
      this.scrollWheelZoom ? this.map.enableScrollWheelZoom() : this.map.disableScrollWheelZoom()
    },
    triggerDoubleClickZoom() {
      this.doubleClickZoom ? this.map.enableDoubleClickZoom() : this.map.disableDoubleClickZoom()
    },
    triggerKeyboard() {
      this.keyboard ? this.map.enableKeyboard() : this.map.disableKeyboard()
    },
    triggerInertialDragging() {
      this.inertialDragging ? this.map.enableInertialDragging() : this.map.disableInertialDragging()
    },
    triggerContinuousZoom() {
      this.continuousZoom ? this.map.enableContinuousZoom() : this.map.disableContinuousZoom()
    },
    triggerPinchToZoom() {
      this.pinchToZoom ? this.map.enablePinchToZoom() : this.map.disablePinchToZoom()
    },
    triggerAutoResize() {
      this.autoResize ? this.map.enableAutoResize() : this.map.disableAutoResize()
    }
  },
  watch: {
    center() {
      this.centerAndZoom()
    },
    zoom() {
      this.setZoom()
    },
    dragging() {
      this.triggerAutoResize()
    },
    scrollWheelZoom() {
      this.triggerScrollWheelZoom()
    },
    doubleClickZoom() {
      this.triggerDoubleClickZoom()
    },
    keyboard() {
      this.triggerKeyboard()
    },
    inertialDragging() {
      this.triggerInertialDragging()
    },
    continuousZoom() {
      this.triggerContinuousZoom()
    },
    pinchToZoom() {
      this.triggerPinchToZoom()
    },
    autoResize() {
      this.triggerAutoResize()
    },
    defaultCursor() {
      this.setDefaultCursor()
    },
    draggingCursor() {
      this.setDraggingCursor()
    },
    minZoom() {
      this.setMinZoom()
    },
    maxZoom() {
      this.setMaxZoom()
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.createScript().then(this.init)
      }, 500)
    })
  }
}
</script>
