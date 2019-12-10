<template>
  <section class="nm-map-search-box" v-loading="loading">
    <el-input v-model="keyword" class="nm-map-search-input" size="small" placeholder="请输入关键字" prefix-icon="el-icon-search" clearable></el-input>
    <div class="nm-map-search-list">
      <el-scrollbar>
        <ul v-if="data.length > 0" class="nm-map-search-list-box">
          <li v-for="(item, i) in data" :key="i" :class="['nm-map-search-list-item', active === i ? 'active' : '']" @click="onSelect(item, i)">
            <div class="title"><i class="el-icon-location-information" /> {{ item.title }}</div>
            <div class="address">{{ item.address }}</div>
            <div class="point">{{ item.point.lng.toFixed(precision) }},{{ item.point.lat.toFixed(precision) }}</div>
          </li>
        </ul>
        <p class="no-data" v-else>没有数据~</p>
      </el-scrollbar>
    </div>
  </section>
</template>
<script>
export default {
  name: 'MapSearch',
  data() {
    return {
      /**关键字 */
      keyword: '',
      /**搜索实例 */
      local: null,
      /**定时器 */
      timer: null,
      /**数据 */
      data: [],
      /**显示加载动画 */
      loading: false,
      /**已选择的 */
      active: ''
    }
  },
  props: {
    /**查询延时，默认800ms */
    delay: {
      type: Number,
      default: 700
    },
    /**保留小数位精度 */
    precision: {
      type: Number,
      default: 4
    },
    /**查询时每页数量，默认15 */
    searchPageCapacity: {
      type: Number,
      default: 15
    }
  },
  methods: {
    init(map) {
      this.local = new BMap.LocalSearch(map, { searchPageCapacity: this.searchPageCapacity, onSearchComplete: this.onSearchComplete })
    },
    search() {
      //删除定时器
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.data = []
        if (this.keyword) {
          this.loading = true
          this.local.search(this.keyword)
        }
      }, this.delay)
    },
    onSearchComplete(results) {
      this.loading = false
      if (this.local.getStatus() == BMAP_STATUS_SUCCESS) {
        this.data = results.Sq.map(m => {
          return { title: m.title, address: m.address, point: m.point }
        })
      } else {
        this.$message.error('查询失败~')
      }

      this.$emit('search', this.data)
    },
    onSelect(item, i) {
      this.active = i
      this.$emit('select', item.point, item)
    },
    reset() {
      this.active = ''
      this.keyword = ''
      this.data = []
    }
  },
  watch: {
    keyword() {
      this.search()
    }
  }
}
</script>
