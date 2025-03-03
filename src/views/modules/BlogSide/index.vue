<template>
  <el-aside :width="width+'%'" style="padding: 30px 0">
    <slot name="prepend"></slot>

    <hot-tag></hot-tag>
    <el-divider>
      <el-icon>
        <star-filled/>
      </el-icon>
    </el-divider>
    <hot-category></hot-category>

    <slot name="append"></slot>

    <el-divider>
      <el-icon>
        <star-filled/>
      </el-icon>
    </el-divider>
    <friend-link></friend-link>

  </el-aside>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {StarFilled} from '@element-plus/icons-vue'
import HotTag from '@/views/modules/HotTag/index.vue'
import HotCategory from '@/views/modules/HotCategory/index.vue'
import FriendLink from '@/views/modules/FriendLink/index.vue'

export default defineComponent({
  name: 'blog-side',
  components: {StarFilled,HotTag,HotCategory,FriendLink},
  props: {
    width: {
      type: Number,
      default: 30
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
