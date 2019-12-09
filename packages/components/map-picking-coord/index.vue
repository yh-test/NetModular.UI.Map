<template>
  <div class="nm-map-picking-coord">
    <el-popover v-model="visible" title="坐标拾取" placement="top" :popper-class="popperClass" :width="width" trigger="manual" @after-enter="onShow">
      <i class="el-icon-close" @click="visible = false"></i>
      <i v-if="fullscreen" :class="fullscreen_ ? 'el-icon-minus' : 'el-icon-rank'" @click="fullscreen_ = !fullscreen_"></i>
      <div class="nm-map-picking-coord-box" :style="{ height: height + 'px' }">
        <div class="left">
          <nm-map :center="center" :zoom="zoom" :scroll-wheel-zoom="scrollWheelZoom" height="100%" @init="onMapInit" />
        </div>
        <div class="right">
          <el-input v-model="keyword" class="search-input" size="small" placeholder="请输入关键字" prefix-icon="el-icon-search" clearable></el-input>
          <div class="search-list" v-loading="loading">
            <el-scrollbar>
              <ul v-if="searchList.length > 0" class="search-list-box">
                <li v-for="(item, i) in searchList" :key="i" :class="['search-list-item', active === i ? 'active' : '']" @click="onSelect(item.point, i)">
                  <div class="title"><i class="el-icon-location-information" /> {{ item.title }}</div>
                  <div class="address">{{ item.address }}</div>
                  <div class="point">{{ item.point.lng.toFixed(precision) }},{{ item.point.lat.toFixed(precision) }}</div>
                </li>
              </ul>
              <p class="no-data" v-else>没有数据~</p>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="nm-map-picking-coord-footer">
        <div class="left">
          <span class="curr"> <i class="el-icon-coordinate"></i>当前坐标：{{ curr }}</span>
        </div>
        <div class="right">
          <el-button size="mini" type="success" @click="onSave">确认</el-button>
          <el-button size="mini" type="info" @click="reset">重置</el-button>
        </div>
      </div>
      <el-input class="nm-map-picking-coord-input" slot="reference" v-model="label" :placeholder="placeholder" :readonly="!allowInput">
        <i slot="suffix" class="el-input__icon el-icon-coordinate" @click="visible = !visible"></i>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'MapPickingCoord',
  data() {
    return {
      visible: false,
      //全屏
      fullscreen_: false,
      map: null,
      center: null,
      keyword: '',
      searchLocal: null,
      searchList: [],
      searchTimer: null,
      loading: false,
      active: null,
      marker: null,
      selection: null,
      defaultPoint: {
        lng: 116.404,
        lat: 39.915
      },
      oldValue: this.value
    }
  },
  props: {
    value: Object,
    /**类型 info、success、primary、warning、danger */
    type: {
      type: String,
      default: 'primary'
    },
    width: {
      type: String,
      default: '850'
    },
    height: {
      type: String,
      default: '350'
    },
    placeholder: {
      type: String,
      default: '请选择坐标'
    },
    allowInput: Boolean,
    /**保留小数位精度 */
    precision: {
      type: Number,
      default: 4
    },
    /**查询时每页数量 */
    searchPageCapacity: {
      type: Number,
      default: 15
    },
    /**是否显示全屏按钮 */
    fullscreen: {
      type: Boolean,
      default: true
    },
    /**启用滚轮放大缩小，默认禁用 */
    scrollWheelZoom: {
      type: Boolean,
      default: true
    },
    /**缩放 */
    zoom: {
      type: Number,
      default: 16
    }
  },
  computed: {
    label: {
      get() {
        if (this.value && typeof this.value === 'object') {
          return `${this.value.lng},${this.value.lat}`
        }
        return ''
      },
      set(val) {
        if (!val || val.indexOf(',') < 0) {
          this.selection = Object.assign({}, this.defaultPoint)
        } else {
          const arr = val.split(',')
          this.selection = { lng: parseFloat(arr[0].trim()), lat: parseFloat(arr[1].trim()) }
        }
        this.center = this.selection
        this.onSave()
      }
    },
    popperClass() {
      return `nm-map-picking-coord-popover ${this.fullscreen_ ? 'fullscreen' : ''} ${this.type}`
    },
    curr() {
      if (this.selection && typeof this.selection === 'object') {
        return `${this.selection.lng},${this.selection.lat}`
      }
      return ''
    }
  },
  methods: {
    //搜索
    search() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchList = []
        if (this.keyword) {
          this.loading = true
          this.searchLocal.search(this.keyword)
        }
      }, 800)
    },
    onMapInit(map) {
      this.map = map

      this.createMarker()

      const _this = this
      //注册点击事件
      this.map.addEventListener('click', function(e) {
        _this.onChange(e.point)
      })

      //创建查询对象
      this.searchLocal = new BMap.LocalSearch(map, { searchPageCapacity: this.searchPageCapacity, onSearchComplete: this.onSearchComplete })
    },
    onSearchComplete(results) {
      this.loading = false
      if (this.searchLocal.getStatus() == BMAP_STATUS_SUCCESS) {
        this.searchList = results.Sq.map(m => {
          return { title: m.title, address: m.address, point: m.point }
        })
      } else {
        this.$message.error('查询失败~')
        return []
      }
    },
    onSelect(point, index) {
      this.active = index
      this.center = point
      this.onChange(point)
    },
    onChange(point) {
      this.selection = {
        lng: point.lng.toFixed(this.precision),
        lat: point.lat.toFixed(this.precision)
      }
    },
    onShow() {
      this.createMarker()
      this.center = Object.assign({}, this.value)
    },
    //创建标注
    createMarker() {
      if (this.visible && typeof BMap !== 'undefined') {
        if (this.marker) {
          this.map.removeOverlay(this.marker)
        }
        this.marker = new BMap.Marker(this.selection) // 创建标注
        this.map.addOverlay(this.marker) // 将标注添加到地图中
      }
    },
    onSave() {
      this.$emit('input', this.selection)
      this.visible = false
    },
    reset() {
      if (this.map) {
        this.center = Object.assign({}, this.oldValue)
        this.selection = Object.assign({}, this.oldValue)
      }
    }
  },
  watch: {
    keyword() {
      this.search()
    },
    selection() {
      this.createMarker()
    }
  },
  created() {
    this.center = Object.assign({}, this.value)
    this.selection = Object.assign({}, this.value)
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
