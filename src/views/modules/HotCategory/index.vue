<template>
  <tag-card :title="'博客分类'" :data="tagList" @on-click="onClick"></tag-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import TagCard from '@/views/modules/TagCard'
import {ElMessage} from 'element-plus'
import {getCategoryListAPI} from '@/service/API/category'
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'hot-category',

  components: {TagCard},

  setup() {
    const router = useRouter()
    const state = reactive({
      // 标签列表
      tagList: []
    })
    /**
     * @name: 热门分类列表
     */
    const getCategoryList = ()=>{
      getCategoryListAPI({}).then((res:any)=>{
          if(res.code === 1){
            state.tagList = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    const onClick = (item:any)=>{
      router.replace({
        path: '/list',
        query: {
          categoryId: item.id
        }
      })
    }

    onMounted(()=>{
      getCategoryList()
    })

    return {
      ...toRefs(state),
      onClick
    }
  }
})
</script>