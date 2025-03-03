<template>
  <el-header>
    <h2 class="flex-butween">
      文章管理
      <el-button type="primary" @click="goEdit()">添加文章</el-button>
    </h2>
  </el-header>
  <el-table :data="articleList">
    <el-table-column type="index" label="#"  width="50" align="center"/>
    <el-table-column label="文章标题" width="300" prop="title" align="center"></el-table-column>
    <el-table-column label="文章分类" prop="category_name" align="center"></el-table-column>
    <el-table-column label="浏览量" prop="views" align="center"></el-table-column>
    <el-table-column label="创建时间" prop="created_time" align="center">
      <template #default="scope">
        <span>{{fromatTime(scope.row.created_time)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="修改时间" prop="updated_time" align="center">
      <template #default="scope">
        <span>{{fromatTime(scope.row.updated_time)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" >
      <template #default="scope" >
        <el-button size="small" @click="goEdit(scope.row.id)" >编辑</el-button>
        <el-popconfirm
            width="220"
            icon-color="#626AEF"
            title="确认删除吗?"
            @confirm="onDelete(scope.row.id)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      class="flex-center"
      hide-on-single-page
      background layout="prev, pager, next"
      :total="total"
      :page-count="pageCount"
      :current-page="apiParams.page"
      @current-change="switchPage"
  />

</template>

<script lang="ts">
import {defineComponent,reactive, onMounted, toRefs, onMounted} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import {getUserArticleListAPI,deleteArticleAPI} from '@/service/API/article'
import {fromatTime} from '@/utils/util'
import {VIEW_TYPE} from '@/utils/enum'
import {IGlobalState} from "@/store";

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      articleList: [],
      apiParams: {
        limit: 10,
        page: 1,
      },
      total: 0,
      pageCount: 0,
      loading: true
    })

    const getArticleList = ()=>{
      state.loading = true
      getUserArticleListAPI({
        ...state.apiParams,
        userId: store.state.user.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.articleList = res.data.rows
          state.pageCount = res.data.pageCount
          state.total = res.data.total
        }else{
          ElMessage.warning(res.msg)
        }
        state.loading = false
      }).catch((err: any)=>{
        state.loading = false
        ElMessage.warning(err.msg)
      })
    }
    const onDelete = (id:number)=>{
      deleteArticleAPI({
        id
      }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success('删除成功!')
          switchPage()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const switchPage = (page:number=1)=>{
      state.apiParams.page = page
      getArticleList()
    }
    const goEdit = (id?:string)=>{
     router.push({
       path: '/admin/edit',
       query: {
         id,
         type: VIEW_TYPE.ARTICLE
       }
     })
    }


    onMounted(()=>{
      switchPage()
    })
    return {
      ...toRefs(state),
      fromatTime,
      onDelete,
      goEdit,
      switchPage
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
