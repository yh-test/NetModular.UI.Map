<template>
  <div class="home" style="width:800px;margin:0 auto;border:1px solid #ccc;padding:5px;">
    <el-form inline>
      <el-form-item label="坐标：">
        <nm-map-picking-coord v-model="value" type="primary" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      value: {
        lng: 116.4,
        lat: 39.91
      }
    }
  },
  methods: {}
}
</script>
