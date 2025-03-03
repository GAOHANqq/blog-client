<template>
  <el-container v-if="isMobile" :class="{isMobile}" v-loading="loading">
    <template v-if="articleList.length">
      <article-list :data="articleList">
        <template #append>
          <el-pagination
              class="flex-center"
              hide-on-single-page
              background layout="prev, pager, next"
              :total="total"
              :page-count="pageCount"
              :current-page="apiParams.page"
              @current-change="init"
          />
        </template>
      </article-list>
    </template>
    <blog-side :width="100"></blog-side>
  </el-container>
  <el-container v-else v-loading="loading">
    <blog-side ></blog-side>
    <template v-if="articleList.length">
      <article-list :data="articleList">
        <template #append>
          <el-pagination
              class="flex-center"
              hide-on-single-page
              background layout="prev, pager, next"
              :total="total"
              :page-count="pageCount"
              :current-page="apiParams.page"
              @current-change="init"
          />
        </template>
      </article-list>
    </template>
    <el-main v-else>
      <el-empty :description="'空空如也~'" v-show="!loading" style="height: 500px"></el-empty>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, watch, computed} from 'vue'
import {getArticleListAPI} from '@/service/API/article'
import ArticleList from '@/views/modules/ArticleList'
import BlogSide from '@/views/modules/BlogSide'
import {ElMessage} from 'element-plus'
import {isMobile} from "@/utils/util";

export default defineComponent({
  name: 'list',

  components: {BlogSide, ArticleList},

  props: {
    // 标签id
    tagId: {
      type: String,
      default: ''
    },
    // 分类id
    categoryId: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const state = reactive({
      apiParams: {
        limit: 10,
        page: 1,
        sort: 2
      },
      articleList: [],
      total: 0,
      pageCount: 0,
      loading: true,
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })

    /**
     * @name: 获取文章列表
     */
    const getArticleList = () => {
      state.loading = true
      getArticleListAPI({
        ...state.apiParams,
        tagId: props.tagId,
        categoryId: props.categoryId
      }).then((res: any) => {
        if (res.code === 1) {
          state.articleList = [...state.articleList, ...res.data.rows]
          state.pageCount = res.data.pageCount
          state.total = res.data.total
        } else {
          ElMessage.warning(res.msg)
        }
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      }).finally(()=>{
        state.loading = false
      })
    }

    const init = (page:number=1)=>{
      state.articleList = []
      state.apiParams = {
        limit: 10,
        sort: 2,
        page
      }
      state.total = 0
      state.pageCount = 0
      getArticleList()
    }

    onMounted(() => {
      init()
    })

    watch(()=>props.tagId, ()=>{
      init()
    })
    watch(()=>props.categoryId, ()=>{
      init()
    })

    return {
      ...toRefs(state),
      init
    }
  }
})
</script>
<style lang="scss" scoped>
.isMobile{
  flex-wrap: wrap;
}
</style>