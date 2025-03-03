<template>
  <el-container :class="{isMobile}">
    <article-list :data="articleList"></article-list>
    <blog-side :width="isMobile?100:30"></blog-side>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, computed} from 'vue'
import {getArticleListAPI} from '@/service/API/article'
import BlogSide from '@/views/modules/BlogSide'
import ArticleList from '@/views/modules/ArticleList'
import {ElMessage} from 'element-plus'
import {isMobile} from "@/utils/util";

export default defineComponent({
  name: 'home',

  components: {BlogSide, ArticleList},

  setup() {
    const state = reactive({
      apiParams: {
        limit: 10,
        page:1
      },
      articleList: [],
      total: 0,
      pageCount: 0,
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })

    /**
     * @name: 获取文章列表
     */
    const getArticleList = ()=>{
      getArticleListAPI(state.apiParams).then((res:any)=>{
          if(res.code === 1){
            state.articleList = res.data.rows
            state.pageCount = res.data.pageCount
            state.total = res.data.total
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }


    onMounted(()=>{
      getArticleList()
    })

    return {
      ...toRefs(state),
    }
  }
})
</script>

<style lang="scss" scoped>
.isMobile{
  flex-wrap: wrap;
}
</style>


