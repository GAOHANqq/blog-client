<template>
  <tag-card :title="'热门标签'" :data="tagList" @on-click="onClick"></tag-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import TagCard from '@/views/modules/TagCard'
import {ElMessage} from 'element-plus'
import {getHotTagListAPI} from '@/service/API/tag'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'hot-tag',

  components: {TagCard},

  setup() {
    const router = useRouter()
    const state = reactive({
      // 标签列表
      tagList: []
    })
    /**
     * @name: 热门标签列表
     */
    const getTagList = ()=>{
      getHotTagListAPI({}).then((res:any)=>{
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
          tagId: item.id
        }
      })
    }

    onMounted(()=>{
      getTagList()
    })

    return {
      ...toRefs(state),
      onClick
    }
  }
})
</script>