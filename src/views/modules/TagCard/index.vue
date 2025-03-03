<template>
  <el-card class="tag-card">
    <el-header class="tag-header">
      <h3>{{title}}</h3>
    </el-header>

    <div class="tag-content">
      <el-space wrap :direction="layout" alignment="flex-start">
        <template v-if="layout===LAYOUT_TYPE.horizontal">


          <template v-for="item in data">
            <el-badge :value="item.article_num" type="primary" v-if="item.article_num">
              <el-button
                  plain
                  class="tag-item"
                  @click="onClick(item)"
              >{{item.name}}</el-button>
            </el-badge>
            <el-button
                v-else
                plain
                class="tag-item"
                @click="onClick(item)"
            >{{item.name}}</el-button>
          </template>
        </template>
        <template v-else>
          <el-link
              :underline="false"
              v-for="item in data"
              :key="item.id"
              class="tag-item vertical"
              @click="onClick(item)"
          >{{item.name}}</el-link>
        </template>
      </el-space>
    </div>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'

/** 布局方式 */
export enum LAYOUT_TYPE{
  /** 水平布局 */
  'horizontal' = 'horizontal',
  /** 垂直布局 */
  'vertical' = 'vertical',
}

export default defineComponent({
  name: 'tag-card',

  emits: ['on-click'],

  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 数据列表
    data: {
      type: Array,
      default: ()=>{}
    },
    // 布局方式
    layout: {
      type: String as PropType<LAYOUT_TYPE>,
      default: LAYOUT_TYPE.horizontal
    }
  },

  setup(props,ctx){

    const onClick = (item:any)=>{
      ctx.emit('on-click',item)
    }
    return {LAYOUT_TYPE,onClick}
  }
})
</script>

<style lang="scss" scoped>
.tag-card{
  .tag-header{
    line-height: 60px;
    text-align: left;
    color: #fff;
    border-radius: 6px;
    background-color: var(--el-color-primary);
    h3{
      margin: 0;
    }
  }
  .tag-content{
    padding-top: 20px;
    text-align: left;
  }
}
</style>
