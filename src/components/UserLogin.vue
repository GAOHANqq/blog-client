<template>
  <div class="user-login" v-if="userId">
    <el-dropdown @command="command">

      <template #default>
        <el-row type="flex" align="middle" style="color: #fff;cursor: pointer">
          <el-avatar :src="addFsUrl(avatar)">
            <el-icon :size="40">
              <Avatar/>
            </el-icon>
          </el-avatar>
          <span style="margin: 0 5px">{{ showName }}</span>
          <el-icon :size="20" color="#fff">
            <ArrowDown/>
          </el-icon>
        </el-row>
      </template>


      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="password" v-if="isAdmin" :icon="Key">修改密码</el-dropdown-item>
          <template v-else>
            <el-dropdown-item command="admin" :icon="HomeFilled">后台管理</el-dropdown-item>
            <el-dropdown-item command="siteconfig" :icon="Setting" v-if="!isMobile">站点设置</el-dropdown-item>
          </template>
          <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <template v-else>
    <el-link style="color: #fff" :underline="false" @click="goLogin(LOGIN_TYPE.LOGIN)">登录</el-link>
    <el-link style="margin-left: 10px;color: #fff" :underline="false" @click="goLogin(LOGIN_TYPE.REGISTER)">注册
    </el-link>
  </template>

  <site-config v-if="isShowSiteConfig" @on-cancel="toggleSiteConfigDialog"></site-config>

</template>

<script lang="ts">
import {defineComponent, computed, reactive, toRefs} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {LOGIN_TYPE} from '@/utils/enum'
import SiteConfig from '@/components/SiteConfig.vue'
import {ArrowDown, Avatar, HomeFilled, SwitchButton, Setting, Key} from '@element-plus/icons-vue'
import {logoutAPI} from '@/service/API/user'
import {ElMessage} from 'element-plus'
import Types from '@/store/action-types'
import {IGlobalState} from "@/store";
import {addFsUrl, isMobile} from '@/utils/util'

export default defineComponent({
  name: 'user-login',

  components: {ArrowDown, Avatar, SiteConfig},

  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      isShowSiteConfig: false,
      userId: computed(() => store.state.user.id),
      avatar: computed(() => store.state.user.avatar),
      showName: computed(() => store.state.user.nickname || store.state.user.username),
      isAdmin: computed(() => router.currentRoute.value.path.includes('admin')),
      // 是否移动端
      isMobile: computed(() => isMobile())
    })

    /**
     * @name: 跳转登录页
     */
    const goLogin = (type: LOGIN_TYPE) => {
      router.push({
        path: type === LOGIN_TYPE.LOGIN ? '/login' : '/register',
        query: {type}
      })
    }

    const logout = () => {
      logoutAPI({}).then((res: any) => {
        if (res.code === 1) {
          store.commit(`user/${Types.LOGOUT}`)
          ElMessage.success('退出登录成功!')
          router.replace('/home')
        } else {
          ElMessage.warning(res.msg)
        }
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      })
    }
    const toggleSiteConfigDialog = (isShowSiteConfig: boolean = false) => {
      state.isShowSiteConfig = isShowSiteConfig
    }
    const command = (command: string) => {
      switch (command) {
        case 'siteconfig':
          toggleSiteConfigDialog(true)
          break
        case 'logout':
          logout()
          break
        case 'admin':
          router.replace('/admin')
          break
        case 'password':
          router.push('/password')
          break
      }
    }

    return {
      ...toRefs(state),
      SwitchButton,
      HomeFilled,
      Setting,
      Key,
      goLogin,
      toggleSiteConfigDialog,
      command,
      addFsUrl,
      LOGIN_TYPE
    }
  }
})
</script>

<style lang="scss" scoped>
.user-login {
  color: #fff;
}
</style>
