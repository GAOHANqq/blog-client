<template>
  <el-container class="article-warp" v-if="isMobile">
    <el-main v-loading="loading">
      <el-header v-if="!loading" height="100">
        <h1 class="flex-center article-title">{{articleInfo.title}}</h1>
        <p class="flex-center">
          <el-button type="text" @click="goUserArticle(articleInfo.user_id)">{{articleInfo.nickname}}</el-button>
          <el-divider direction="vertical" />
          {{fromatTime(articleInfo.updated_time)}}
          <el-divider direction="vertical" />
          阅读({{articleInfo.views}})
        </p>
      </el-header>

      <v-md-editor v-model="articleInfo.body" mode="preview" height="fit-content">></v-md-editor>

      <blog-side :width="100">
        <template #prepend>
          <relate-article :articleId="articleInfo.id" :categoryId="articleInfo.category_id" v-if="articleInfo.category_id"></relate-article>
        </template>
      </blog-side>

      <el-footer height="120px">
        <el-link type="info" :underline="false" disabled>© 著作权归作者所有</el-link>
        <p v-if="articleInfo.category_name">
          <el-space>
            <b>分类</b><el-button type="primary" plain @click="goCategory">{{articleInfo.category_name}}</el-button>
          </el-space>
        </p>
        <p v-if="articleInfo.tag_name">
          <el-space>
            <b>标签</b>

            <el-button type="success" plain @click="goTag(articleInfo.tag_id,index)" v-for="(tag,index) in articleInfo.tag_name.split(',')" :key="tag">{{tag}}</el-button>
          </el-space>
        </p>
      </el-footer>
    </el-main>
  </el-container>
  <el-container class="article-warp" v-else>

    <blog-side :width="width">
      <template #prepend>
        <el-alert
            v-if="width===30"
            title="收起左侧"
            center
            close-text="<<"
            @close="switchWidth"
            style="margin-bottom: 10px"
        />
        <el-alert
            v-else
            title="展开左侧"
            center
            close-text=">>"
            @close="switchWidth"
            style="margin-bottom: 10px"
        />
      </template>

      <template #append>
        <relate-article :articleId="articleInfo.id" :categoryId="articleInfo.category_id" v-if="articleInfo.category_id"></relate-article>
      </template>
    </blog-side>

    <el-main v-loading="loading">
      <el-header v-if="!loading" height="100">
        <h1 class="flex-center article-title">{{articleInfo.title}}</h1>
        <p class="flex-center">
          <el-button type="text" @click="goUserArticle(articleInfo.user_id)">{{articleInfo.nickname}}</el-button>
          <el-divider direction="vertical" />
          {{fromatTime(articleInfo.updated_time)}}
          <el-divider direction="vertical" />
          阅读({{articleInfo.views}})
        </p>
      </el-header>

      <v-md-editor v-model="articleInfo.body" mode="preview" height="fit-content">></v-md-editor>

      <el-footer height="120px">
        <el-link type="info" :underline="false" disabled>© 著作权归作者所有</el-link>
        <p v-if="articleInfo.category_name">
          <el-space>
            <b>分类</b><el-button type="primary" plain @click="goCategory">{{articleInfo.category_name}}</el-button>
          </el-space>
        </p>
        <p v-if="articleInfo.tag_name">
          <el-space>
            <b>标签</b>

            <el-button type="success" plain @click="goTag(articleInfo.tag_id,index)" v-for="(tag,index) in articleInfo.tag_name.split(',')" :key="tag">{{tag}}</el-button>
          </el-space>
        </p>
      </el-footer>
    </el-main>

  </el-container>

</template>

<script lang="ts">
import {defineComponent, watch, reactive, toRefs, onMounted, computed} from 'vue'
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import {getArticleDetailAPI,saveArticleViewsAPI} from '@/service/API/article'
import {fromatTime, isMobile} from '@/utils/util'
import BlogSide from '@/views/modules/BlogSide/index.vue'
import RelateArticle from '@/views/modules/RelateArticle/index.vue'

export default defineComponent({
  name: 'detail',

  components: {BlogSide,RelateArticle},

  props: {
    // 文章id
    id: {
      type:String,
      default: ''
    }
  },

  setup(props) {
    const router = useRouter()
    const state = reactive({
      articleInfo: {},
      loading: true,
      width: 30,
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })

    const getArticleInfo = ()=>{
      state.loading = true
      getArticleDetailAPI({
        id: props.id
      }).then((res:any)=>{
          if(res.code === 1){
            state.articleInfo = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      }).finally(()=>{
        state.loading = false
      })
    }
    const saveArticleViews = ()=>{
      saveArticleViewsAPI({
        id: props.id
      }).then((res:any)=>{
          if(res.code === 1){

          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    const goUserArticle = (userId: string)=>{
      router.replace({
        path: '/userarticle',
        query: {
          userId
        }
      })
    }
    const goCategory = ()=>{
      router.replace({
        path: '/list',
        query: {
          categoryId: state.articleInfo.category_id
        }
      })
    }
    const goTag = (tag_ids:string,index:number)=>{
      router.replace({
        path: '/list',
        query: {
          tagId: tag_ids.split(',')[index]
        }
      })
    }


    const switchWidth = ()=>{
      state.width = state.width === 30 ? 10 : 30
      return false
    }

    const init = ()=>{
      state.articleInfo = {}
      saveArticleViews()
      getArticleInfo()
    }

    onMounted(()=>{
      init()
    })

    watch(()=>props.id, ()=>{
      init()
    })

    return {
      ...toRefs(state),
      fromatTime,
      goUserArticle,
      goCategory,
      goTag,
      switchWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.article-warp{
  .el-main{
    overflow: hidden;
  }

  text-align: left;
  .article-title{
    font-size: 36px;
  }
}
</style>
