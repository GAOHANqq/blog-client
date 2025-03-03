<template>
  <el-container :class="{isMobile}" v-loading="loading">
    <blog-side v-if="!isMobile"></blog-side>
    <el-main v-if="messageList.length">
      <el-row>
        <template v-for="item in messageList">
          <el-col class="flex-butween message-item">
            <p><span class="label">● {{item.user_name}}：</span>{{item.message}}</p>
            <span>
            <template v-if="item.user_id===userId">
                <el-button plain size="small" type="primary" @click="onEdit(item)">编辑</el-button>
                <el-popconfirm
              width="220"
              icon-color="#626AEF"
              title="确认删除吗?"
              @confirm="onDelete(item.id)"
          >
              <template #reference>
                <el-button plain size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            </template>
          </span>
          </el-col>
          <el-col class="message-time">
            {{fromatTime(item.created_time)}}
            <el-tag type="info" v-if="item.user_id===userId" size="small">我的留言</el-tag>
          </el-col>
        </template>
      </el-row>
      <el-pagination
          class="flex-center"
          hide-on-single-page
          background layout="prev, pager, next"
          :total="total"
          :page-count="pageCount"
          :current-page="apiParams.page"
          @current-change="switchPage"
      />

      <el-form>
        <el-form-item>
          <el-input
              type="textarea"
              v-model="message"
              placeholder="请输入您的留言"
              clearable
              style="width: 88%;margin-right: 20px;margin-top: 10px"
              :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
          <el-button type="primary" @click="onSubmit" class="submit-btn">提交</el-button>
        </el-form-item>
      </el-form>

    </el-main>
    <el-main v-else>
      <el-form>
        <el-form-item>
          <el-input
              type="textarea"
              v-model="message"
              placeholder="请输入您的留言"
              clearable
              style="width: 88%;margin-right: 20px;margin-top: 10px"
              :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
      <el-empty :description="'空空如也~'" v-show="!loading" style="height: 500px"></el-empty>
    </el-main>
  </el-container>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, computed} from 'vue'
import {useStore} from "vuex";
import {editMessageAPI,deleteMessageAPI,getMessageListAPI} from '@/service/API/message'
import {ElMessage, ElMessageBox} from "element-plus";
import BlogSide from '@/views/modules/BlogSide'
import {fromatTime, isMobile} from '@/utils/util'
import {IGlobalState} from "@/store";


export default defineComponent({
  name: 'message',
  components: {BlogSide},
  setup() {
    const store = useStore<IGlobalState>();

    const state = reactive({
      userId: computed(()=>store.state.user.id),
      apiParams: {
        limit: 10,
        page: 1
      },
      messageList: [],
      total: 0,
      pageCount: 0,
      loading: true,
      message: '',
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })

    const getMessageList = ()=>{
      state.loading = true
      getMessageListAPI(state.apiParams).then((res:any)=>{
          if(res.code === 1){
            state.messageList = res.data.rows
            state.pageCount = res.data.pageCount
            state.total = res.data.total
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      }).finally(()=>{
        state.loading = false
      })
    }


    const switchPage = (page:number=1)=>{
      state.apiParams.page = page
      getMessageList()
    }

    const onDelete = (id:string)=>{
      deleteMessageAPI({id}).then((res:any)=>{
          if(res.code === 1){
            ElMessage.success('删除成功!')
            state.messageList = state.messageList.filter((item:any)=>{return item.id !== id})
            if( state.messageList.length === 0 && state.apiParams.page > 1 ){
              state.apiParams.page --
              switchPage(state.apiParams.page)
            }
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    const onEdit = (item:any)=>{
      ElMessageBox.prompt('请输入您的留言', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: item.message
      }).then(({ value }) => {
        editMessageAPI({
          id: item.id,
          message: value
        }).then((res:any)=>{
            if(res.code === 1){
              item.message = value
              ElMessage.success('编辑成功!')
            }else{
             ElMessage.warning(res.msg)
            }
        }).catch((err: any)=>{
            ElMessage.warning(err.msg)
        })
      })

    }
    const onSubmit = ()=>{
      if( !state.message ){
        ElMessage.warning('留言不可为空!')
        return
      }
      editMessageAPI({
        message: state.message
      }).then((res:any)=>{
        if(res.code === 1){
          state.message = ''
          ElMessage.success('添加留言成功!')
          switchPage()
        }else{
          ElMessage.warning(res.msg)
        }
      })

    }

    onMounted(()=>{
      switchPage()
    })
    
    return {
      ...toRefs(state),
      switchPage,
      fromatTime,
      onDelete,
      onEdit,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item{
  p{
    width: 80%;
    text-align: left;
  }
  .label{
    color: #acb1b7;
  }
}

.message-time{
  color: #acb1b7;
  text-align: left;
  font-size: 14px;
}

.isMobile{
  .message-item p{
    width: 65%;
  }
  .submit-btn{
    margin-top: 10px;
  }
}
</style>
