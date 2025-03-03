<template>
  <tag-card
      :title="'相关文章'"
      :data="tagList"
      :layout="LAYOUT_TYPE.vertical"
      @on-click="goDetail"
  ></tag-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import TagCard,{LAYOUT_TYPE} from '@/views/modules/TagCard'
import {ElMessage} from 'element-plus'
import {getRelateArticleListAPI} from '@/service/API/article'
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'hot-tag',

  components: {TagCard},

  props: {
    // 分类id
    categoryId: {
      type: Number,
      required: true
    },
    // 文章id
    articleId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const router = useRouter()
    const state = reactive({
      // 标签列表
      tagList: []
    })
    /**
     * @name: 热门标签列表
     */
    const getTagList = ()=>{
      getRelateArticleListAPI({
        categoryId: props.categoryId,
        articleId: props.articleId
      }).then((res:any)=>{
          if(res.code === 1){
            state.tagList = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    /**
     * @name: 跳转文件详情
     * @param item 当前文章对象
     */
    const goDetail = (item:any)=>{
      router.replace({
        path: '/detail',
        query: {
          id: item.id
        }
      })
    }

    onMounted(()=>{
      getTagList()
    })

    return {
      ...toRefs(state),
      LAYOUT_TYPE,
      goDetail
    }
  }
})
</script>