<template>
  <el-form ref="loginRef" :model="form" :rules="rules" :class="['login-content',{isMobile}]" label-width="100px">
    <p>{{ isLogin ? '登录' : '注册' }}</p>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
    </el-form-item>

    <template v-if="isLogin">
      <el-form-item class="login-footer">
        <el-button type="primary" @click="login">登录</el-button>
        <el-link type="warning" :underline="false" @click="switchPageType(LOGIN_TYPE.REGISTER)">没有账号-注册</el-link>
        <el-link type="info" :underline="false" @click="back">暂不登录</el-link>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="重复密码" prop="repassword">
        <el-input v-model="form.repassword" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item class="login-footer">
        <el-button type="primary" @click="register">注册</el-button>
        <el-link type="warning" :underline="false" @click="switchPageType(LOGIN_TYPE.LOGIN)">已有账号-登录</el-link>
        <el-link type="info" :underline="false" @click="back">暂不注册</el-link>
      </el-form-item>
    </template>

  </el-form>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs, watch, onMounted, PropType, computed} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {LOGIN_TYPE} from '@/utils/enum'
import {loginAPI, registerAPI} from '@/service/API/user'
import {ElMessage} from 'element-plus'
import Types from '@/store/action-types'
import {IGlobalState} from "@/store";
import {isMobile, getQueryString} from "@/utils/util";

export default defineComponent({
  props: {
    // 类型 1登录 2注册 3 sso校验
    type: {
      type: String as PropType<LOGIN_TYPE>,
      default: LOGIN_TYPE.LOGIN
    }
  },

  setup(props) {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const loginRef: any = ref<any>(null)
    const state = reactive({
      form: {
        username: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        repassword: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      curType: props.type,
      // 是否移动端
      isMobile: computed(() => isMobile())
    })

    const isLogin = computed(() => [LOGIN_TYPE.SSO, LOGIN_TYPE.LOGIN].includes(state.curType))

    /**
     * @name: 登录
     */
    const login = () => {
      validate().then(() => {
        loginAPI({
          username: state.form.username,
          password: state.form.password,
        }).then((res: any) => {
          if (res.code === 1) {
            store.commit(`user/${Types.SET_USER_INFO}`, res.data)
            store.dispatch(`app/${Types.GET_SITE_INFO}`)

            ElMessage.success('登录成功!')
            back()
          } else {
            ElMessage.warning(res.msg)
          }
        }).catch((err: any) => {
          ElMessage.warning(err.msg)
        })
      })
    }
    /**
     * @name: 注册
     */
    const register = () => {
      validate().then(() => {
        registerAPI(state.form).then(() => {
          ElMessage.success('注册成功!')
          switchPageType(LOGIN_TYPE.LOGIN)
        }).catch((err: any) => {
          ElMessage.warn(err.msg)
        })
      })
    }

    const validate = () => {
      const p = new Promise((resolve, reject) => {
        loginRef.value.validate((valid: boolean) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
      return p
    }
    const back = () => {
      const backUrl = getQueryString('back_url')
      if (backUrl) {
        location.replace(backUrl)
        return
      }
      router.back()
    }
    const switchType = (type: LOGIN_TYPE) => {
      state.curType = type
    }
    const switchPageType = (type: LOGIN_TYPE) => {
      router.replace({
        path: type === LOGIN_TYPE.LOGIN ? '/login' : '/register',
        query: {type}
      })
    }


    onMounted(() => {
      switchType(props.type)
    })

    watch(() => props.type, () => {
      switchType(props.type)
    })

    return {
      loginRef,
      ...toRefs(state),
      LOGIN_TYPE,
      isLogin,
      register,
      login,
      back,
      switchPageType,
    }
  }
})
</script>

<style lang="scss" scoped>
.login-content {
  width: 20%;
  margin: 120px auto;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);

  &.isMobile {
    width: 95%;
  }

  p {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    text-align: left;
    padding: 10px;
  }

  .el-form-item {
    padding-right: 30px;

    &.login-footer {
      padding-bottom: 20px;

      .el-link {
        margin-left: 15px;
      }
    }
  }
}
</style>
