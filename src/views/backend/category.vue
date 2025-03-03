<template>
  <el-header>
    <h2 class="flex-butween">
      分类管理
      <el-button type="primary" @click="goEdit()">添加分类</el-button>
    </h2>
  </el-header>
  <el-table :data="categoryList">
    <el-table-column type="index" label="#"  width="50" align="center"/>
    <el-table-column label="分类名称" prop="name" align="center"></el-table-column>
    <el-table-column label="文章数量" prop="article_num" align="center"></el-table-column>
    <el-table-column label="创建时间" prop="created_time" align="center">
      <template #default="scope">
       <span>{{fromatTime(scope.row.created_time)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button size="small" @click="goEdit(scope.row.id)">编辑</el-button>
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
</template>

<script lang="ts">
import {defineComponent, reactive, onMounted, toRefs, onMounted} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import {getCategoryListAPI,deleteCategory} from '@/service/API/category'
import {fromatTime} from '@/utils/util'
import {VIEW_TYPE} from '@/utils/enum'
import {IGlobalState} from "@/store";

export default defineComponent({
  name: 'category',
  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();

    const state = reactive({
      categoryList: []
    })


    const getCategoryList = ()=>{
      getCategoryListAPI({
        userId: store.state.user.id
      }).then((res:any)=>{
          if(res.code === 1){
            state.categoryList = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }


    const onDelete = (id:number)=>{
      deleteCategory({
        id
      }).then((res:any)=>{
          if(res.code === 1){
            ElMessage.success('删除成功!')
            getCategoryList()
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }
    const goEdit = (id?:string)=>{
      router.push({
        path: '/admin/edit',
        query: {
          id,
          type: VIEW_TYPE.CATEGORY
        }
      })
    }

    onMounted(()=>{
      getCategoryList()
    })
    return {
      ...toRefs(state),
      fromatTime,
      goEdit,
      onDelete
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
