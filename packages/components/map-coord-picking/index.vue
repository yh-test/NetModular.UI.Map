<template>
  <div class="nm-map-coord-picking">
    <el-input ref="label" class="nm-map-coord-picking-input" v-model="label" :disabled="disabled" :placeholder="placeholder" @change="onLabelChange" :readonly="!allowInput">
      <i slot="suffix" class="el-input__icon el-icon-coordinate" @click="show"></i>
    </el-input>

    <nm-dialog v-bind="dialog" :visible.sync="visible" @opened="onOpened">
      <template v-slot:title>
        {{ dialog.title }} (<span class="nm-size-14 nm-text-danger">当前坐标 : {{ label_ }}</span
        >)
      </template>
      <div class="nm-map-coord-picking-box" v-loading="loading">
        <nm-split v-model="split">
          <template v-slot:left>
            <div class="left">
              <nm-map :center="center" :zoom="zoom" :scroll-wheel-zoom="scrollWheelZoom" height="100%" @init="onMapInit" />
            </div>
          </template>
          <template v-slot:right>
            <div class="right">
              <div class="nm-map-coord-picking-search">
                <nm-map-search ref="search" :precision="precision" :delay="delay" :search-page-capacity="searchPageCapacity" @select="onSelect" />
              </div>
              <div class="nm-map-coord-picking-buttons">
                <el-button type="success" @click="save">确认</el-button>
                <el-button type="info" @click="reset">重置</el-button>
              </div>
            </div>
          </template>
        </nm-split>
      </div>
    </nm-dialog>
  </div>
</template>
<script>
export default {
  name: 'MapCoordPicking',
  data() {
    return {
      split: 0.8,
      /**是否显示 */
      visible: false,
      /**地图实例 */
      map: null,
      /**中心点 */
      center: null,
      /**标注对象 */
      marker: null,
      /**选择的的坐标点 */
      selection: null,
      loading: true,
      oldValue: this.value,
      /**显示的坐标 */
      label: '',
      /**是否手动输入 */
      isManualInput: false,
      /**打开对话框时是否需要重置标注 */
      resetMarkerOnOpen: false
    }
  },
  props: {
    value: Object,
    /**标题 */
    title: {
      type: String,
      default: '坐标拾取'
    },
    /**图标 */
    icon: {
      type: String,
      default: 'coordinate'
    },
    /**是否显示全屏按钮 */
    fullscreen: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '70%'
    },
    height: {
      type: String,
      default: '80%'
    },
    placeholder: {
      type: String,
      default: '请输入或选择坐标，如：116.404,39.915'
    },
    /**禁用 */
    disabled: Boolean,
    /**允许手动输入 */
    allowInput: Boolean,
    /**查询延时，默认700ms */
    delay: {
      type: Number,
      default: 700
    },
    /**保留小数位精度 */
    precision: {
      type: Number,
      default: 3
    },
    /**查询时每页数量，默认15 */
    searchPageCapacity: {
      type: Number,
      default: 15
    },
    /**启用滚轮放大缩小，默认启用 */
    scrollWheelZoom: {
      type: Boolean,
      default: true
    },
    /**缩放 */
    zoom: Number
  },
  computed: {
    dialog() {
      return {
        title: this.title,
        icon: this.icon,
        fullscreen: this.fullscreen,
        noScrollbar: true,
        width: this.width,
        height: this.height,
        draggable: true
      }
    },
    label_() {
      if (this.selection) {
        return `${this.selection.lng},${this.selection.lat}`
      } else {
        return ''
      }
    }
  },
  methods: {
    /**重置 */
    reset() {
      if (this.map) {
        this.setSelection(this.oldValue)
        this.setCenter(this.oldValue)
        this.createMarker()
        this.$refs.search.reset()
      }
      this.setSelection(this.oldValue)
      this.save()
    },
    show() {
      if (!this.disabled) this.visible = !this.visible
    },
    save() {
      this.setLabel()
      this.$emit('input', this.selection ? Object.assign({}, this.selection) : null)
      this.visible = false
    },
    /**重置中心坐标 */
    setCenter(point) {
      this.center = point ? Object.assign({}, point) : null
    },
    /**设置选择的坐标点 */
    setSelection(point) {
      if (point) {
        this.selection = {
          lng: parseFloat(point.lng).toFixed(this.precision),
          lat: parseFloat(point.lat).toFixed(this.precision)
        }
      } else {
        this.selection = null
      }
    },
    setLabel() {
      if (this.selection) {
        this.label = `${this.selection.lng},${this.selection.lat}`
      } else {
        this.label = ''
      }
    },
    //创建标注
    createMarker() {
      if (typeof BMap !== 'undefined') {
        //先删除，再创建
        if (this.marker) {
          this.map.removeOverlay(this.marker)
        }
        if (this.selection) {
          this.marker = new BMap.Marker(this.selection)
          this.map.addOverlay(this.marker)
        }
      }
    },
    onMapInit(map) {
      this.map = map
      //初始化搜索
      this.$refs.search.init(map)
      //关闭loading
      this.loading = false

      //设置标注
      this.createMarker()

      const _this = this
      //注册点击事件
      this.map.addEventListener('click', function(e) {
        _this.setSelection(e.point)
        _this.createMarker()
      })
    },
    onSelect(point) {
      this.setSelection(point)
      this.setCenter(point)
      this.createMarker()
    },
    onOpened() {
      if (this.resetMarkerOnOpen && this.map) {
        const _this = this
        setTimeout(() => {
          _this.createMarker()
          _this.setCenter(this.value)
        }, 200)
        this.resetMarkerOnOpen = false
      }
    },
    onLabelChange(val) {
      let point = null
      this.refreshMarkerOnOpen = true

      if (val.indexOf(',') < 0 || val.endsWith(',') || val.startsWith(',')) {
        this.label = ''
        this._warning('坐标无效')
        return
      }

      const arr = val.split(',')
      point = {
        lng: arr[0],
        lat: arr[1]
      }
      this.isManualInput = true

      this.$emit('input', point)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.setSelection(val)

        //如果是手动输入，需要重新设置中心坐标，并且再打开时需要重置标注，反之，需要设置label
        if (this.isManualInput) {
          this.resetMarkerOnOpen = true
          if (!this.map) {
            this.setCenter(val)
          }
        } else {
          this.setLabel()
        }
      }
    }
  },
  created() {
    //首次创建设置中心坐标
    if (!this.center) {
      this.setCenter(this.value)
    }
  }
}
</script>
