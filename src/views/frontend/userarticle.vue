<template>
  <el-container v-if="isMobile" class="isMobile" v-loading="loading">
    <user-info :userId="userId" :size="120" class="user-info"></user-info>
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
  <el-container v-else v-loading="loading">
    <blog-side>
      <template #prepend>
        <user-info :userId="userId" :size="120"></user-info>
      </template>

    </blog-side>
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
import ArticleList from '@/views/modules/ArticleList'
import BlogSide from '@/views/modules/BlogSide'
import UserInfo from '@/views/modules/UserInfo'
import {ElMessage} from 'element-plus'
import {getUserArticleListAPI} from '@/service/API/article'
import {isMobile} from "@/utils/util";


export default defineComponent({
  name: 'user-article',

  props: {
    userId: {
      type:String,
      required: true
    }
  },

  components: {UserInfo,BlogSide,ArticleList},

  setup(props) {
    const state = reactive({
      apiParams: {
        limit: 10,
        page: 1
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
      getUserArticleListAPI({
        ...state.apiParams,
        userId: props.userId
      }).then((res: any) => {
        if (res.code === 1) {
          state.articleList = [...state.articleList, ...res.data.rows]
          state.pageCount = res.data.pageCount
          state.total = res.data.total
          state.loading = false
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
        page
      }
      state.total = 0
      state.pageCount = 0
      getArticleList()
    }

    onMounted(() => {
      init()
    })

    watch(()=>props.userId, ()=>{
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
  .user-info{
    width: 100%;
    margin-top: 10px;
  }
}
</style>
