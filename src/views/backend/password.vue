<template>
  <el-form ref="passRef" :model="form" :rules="rules" :class="['password-content',{isMobile}]" label-width="100px">
    <p>修改密码</p>
    <el-form-item label="旧密码" prop="oldpassword">
      <el-input v-model="form.oldpassword" placeholder="请输入旧密码" type="password"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入新密码" type="password"></el-input>
    </el-form-item>
    <el-form-item label="重复密码" prop="repassword">
      <el-input v-model="form.repassword" placeholder="请输入重复密码" type="password"></el-input>
    </el-form-item>
    <el-form-item class="password-footer">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {updatePasswordAPI} from '@/service/API/user'
import {ElMessage} from 'element-plus'
import {IGlobalState} from "@/store";
import Types from '@/store/action-types'
import {isMobile} from "@/utils/util";

export default defineComponent({
  name: 'password',

  setup() {
    const router = useRouter()
    const passRef = ref<any>(null)
    const store = useStore<IGlobalState>();
    const validaterePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== state.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const state = reactive({
      form: {
        oldpassword: '',
        password: '',
        repassword: ''
      },
      rules: {
        oldpassword: [ { required: true, message: '请输入旧密码', trigger: 'blur' }],
        password: [ { required: true, message: '请输入新密码', trigger: 'blur' }],
        repassword: [
            { required: true, message: '请输入重复密码', trigger: 'blur' },
            { validator: validaterePass, trigger: 'blur' }
        ]
      },
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })

    const cancel = ()=>{
      router.back()
    }



    const confirm = ()=>{
      passRef.value.validate((valid:boolean) => {
        valid &&  saveResult()
      })
    }

    const saveResult = ()=>{
      updatePasswordAPI({
        ...state.form
      }).then((res:any)=>{
          if(res.code === 1){
            ElMessage.success('密码修改成功!')
            store.commit(`user/${Types.LOGOUT}`)
            router.replace('/login')
          }else{
           ElMessage.warning(res.msg)
          }
      }).catch((err: any)=>{
          ElMessage.warning(err.msg)
      })
    }

    return {
      ...toRefs(state),
      passRef,
      confirm,
      cancel
    }
  }
})
</script>

<style lang="scss" scoped>
.password-content{
  width: 20%;
  margin: 120px auto;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  &.isMobile{
    width: 95%;
  }
  p{
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    text-align: left;
    padding: 10px;
  }
  .el-form-item{
    padding-right: 30px;
    &.password-footer{
      padding-bottom: 20px;
      .el-link{
        margin-left: 15px;
      }
    }
  }
}
</style>
