<template>
  <div class="nm-map-location">
    <nm-map :center="center" :zoom="zoom" height="100%" @init="onMapInit" />
  </div>
</template>
<script>
export default {
  name: 'MapLocation',
  data() {
    return {
      map: null,
      marker: null
    }
  },
  props: {
    /**要显示的位置坐标 */
    center: {
      type: [Object, String],
      default() {
        return {
          lng: 116.404,
          lat: 39.915
        }
      }
    },
    zoom: {
      type: Number,
      default: 15
    }
  },
  methods: {
    //创建标注
    createMarker() {
      if (typeof BMap !== 'undefined') {
        //先删除，再创建
        if (this.marker) {
          this.map.removeOverlay(this.marker)
        }
        if (this.center) {
          this.marker = new BMap.Marker(this.center)
          this.map.addOverlay(this.marker)
        }
      }
    },
    onMapInit(map) {
      this.map = map
      //设置标注
      this.createMarker()
    }
  },
  watch: {
    center() {
      this.$nextTick(() => {
        this.createMarker()
      })
    }
  }
}
</script>
