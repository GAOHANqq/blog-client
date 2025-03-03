<template>
  <el-header>
    <h2 class="flex-butween">
      {{ name }}管理
      <el-button type="primary" @click="goEdit()">添加{{ name }}</el-button>
    </h2>
  </el-header>
  <el-table :data="linkList">
    <el-table-column type="index" label="#"  width="50" align="center"/>
    <el-table-column :label="`${name}名称`" prop="name" align="center"></el-table-column>
    <el-table-column :label="`${name}地址`" prop="link" align="center"></el-table-column>
    <el-table-column :label="`${name}图标`" prop="src" align="center">
      <template #default="scope">
        <el-image style="width: 100px; height: 100px" :src="addFsUrl(scope.row.src)" v-if="scope.row.src" />
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
import {defineComponent, reactive, onMounted, toRefs, watch, computed} from 'vue'
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import {getLinkListAPI,deleteLinkAPI} from '@/service/API/site'
import {VIEW_TYPE,IINK_TYPE} from '@/utils/enum'
import {addFsUrl} from '@/utils/util'

export default defineComponent({
  name: 'link',

  props:{
    // 类型 1友链 2案例
    type: {
      type:Number,
      default: IINK_TYPE.FRIND
    }
  },

  setup(props) {
    const router = useRouter()
    const state = reactive({
      linkList: []
    })
    const name = computed(()=>props.type === IINK_TYPE.FRIND ? '友链' : '案例')

    const getLinkList = ()=>{
      getLinkListAPI({type: props.type}).then((res:any)=>{
          if(res.code === 1){
            state.linkList = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }
    const onDelete = (id:number)=>{
      deleteLinkAPI({
        id
      }).then((res:any)=>{
          if(res.code === 1){
            ElMessage.success('删除成功!')
            getLinkList()
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
          type: props.type === IINK_TYPE.FRIND ? VIEW_TYPE.LINK : VIEW_TYPE.EXAMPLE
        }
      })
    }

    onMounted(()=>{
      getLinkList()
    })

    watch(()=>props.type, ()=>{
      getLinkList()
    })

    return {
      ...toRefs(state),
      addFsUrl,
      name,
      goEdit,
      onDelete
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
