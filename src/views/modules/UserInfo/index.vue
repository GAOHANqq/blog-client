<template>
  <div class="user-info">
    <el-avatar :src="addFsUrl(userInfo.avatar)" :size="size">
      <el-icon :size="size"><Avatar/></el-icon>
    </el-avatar>


    <p>{{userInfo.nickname}}</p>
    <p>个人简介： {{userInfo.intro}}</p>
    <p>博文数量： {{userInfo.article_num}}</p>

    <template v-if="isAdmin">
      <p>邮箱：<a href="mailto:1271448267@qq.com">1271448267@qq.com</a></p>
      <p>Github：<a href="https://github.com/GAOHANqq" target="_blank">GAOHANqq</a></p>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, watch, computed} from 'vue'
import {getUserInfoByUserId} from '@/service/API/user'
import {ElMessage} from 'element-plus'
import {Avatar} from '@element-plus/icons-vue'
import {addFsUrl} from '@/utils/util'
import {USER_TYPE} from "@/utils/enum";

export default defineComponent({
  name: 'user-info',

  components: {Avatar},

  props: {
    // 用户id
    userId: {
      type: String,
      required: true
    },
    // 头像尺寸
    size: {
      type: Number,
      default: 40
    }
  },
  setup(props) {
    const state = reactive({
      userInfo: {}
    })

    const isAdmin = computed(()=>state.userInfo.usertype === USER_TYPE.ADMIN)

    const getUserInfo = ()=>{
      getUserInfoByUserId({
        userId: props.userId
      }).then((res:any)=>{
          if(res.code === 1){
            state.userInfo = res.data
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    onMounted(()=>{
      getUserInfo()
    })
    watch(props.userId, ()=>{
      getUserInfo()
    })

    return {
      ...toRefs(state),
      addFsUrl,
      isAdmin
    }
  }
})
</script>

<style lang="scss" scoped>
.user-info{
  p{
    a{
      text-decoration: none;
      color: inherit;
      &:hover{
        color: var(--el-color-primary)
      }
    }
  }
}

</style>
