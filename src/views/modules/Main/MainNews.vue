<template>
  <el-card
    v-loading="loading"
    header="微博热搜"
    style="border: none;background: rgba(0,0,0,.15);color: #fff"
    :body-style="{
      overflow: 'auto',
    }"
  >
    <div v-for="(item,index) in hotList" :key="index" class="word-item">
      <a :href="item.url" target="_blank" :title="`热度: ${item.hot||(index+1)}`">
        <b :class="`sort sort_${index+1}`">{{index+1}}</b>
        {{item.title}}
      </a>
    </div>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, reactive,  toRefs, onMounted} from 'vue'
import {wbhotAPI} from "@/service/API/third";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'main-news',

  setup() {
    const state = reactive({
      hotList: [] as any[],
      loading: true
    })
    const getWBHotWord = ()=>{
      state.loading = true
      wbhotAPI().then((res:any)=>{
        state.hotList = res.data
     }).catch((err: any)=>{
         ElMessage.warning(err.msg)
     }).finally(()=>{
       state.loading = false
      })
    }

    onMounted(()=>{
      getWBHotWord()
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
  .word-item{
    text-align: left;
    line-height: 45px;
    cursor: pointer;
    .sort{
      &.sort_1{
        color: #ff5722;
      }
      &.sort_2{
        color: #ff6a27;
      }
    }

    a{
      color: inherit;
      text-decoration: none;
      &:hover{
        color: var(--el-color-primary);
      }
    }

  }
</style>
