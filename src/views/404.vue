<template>
  <div class="no-view-warp flex-center">
    <el-empty :description="'空空如也~'"></el-empty>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'


export default defineComponent({
  name: '404'
})
</script>

<style lang="scss" scoped>
.no-view-warp{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
