<template>
  <el-row
      v-if="isMobile"
      :style="{
        backgroundColor: header.bg,
        color: header.color,
        height: '60px'
      }"
      type="flex"
      align="middle"
      justify="center"
  >
    <el-col :span="8">
      <user-login></user-login>
    </el-col>
    <el-col :span="12">
      {{title}}
    </el-col>
    <el-col :span="4">
      <el-dropdown @command="switchView">
        <i class="el-icon-menu"></i>
        <el-icon color="#fff" :size="20"><Menu/></el-icon>
        <template #dropdown>
          <el-dropdown-menu >
            <el-dropdown-item :command="item.value"  v-for="item in meunList" :key="item.value">{{ item.text }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>

  <el-header
      v-else
      class="home-header"
     :style="{
      backgroundColor: header.bg,
      color: header.color
    }"
  >
    <el-row class="menu-list" type="flex" align="middle" justify="space-between">
      <el-col :span="12">
        <el-col
            v-for="(item, index) in meunList"
            :key="index"
            :class="['menu-item',{active: curPath===item.value}]"
            @click="switchView(item.value)"
        >
          {{ item.text }}
        </el-col>
      </el-col>


      <el-col :span="2">
        <user-login></user-login>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from 'vue'
import {useStore} from "vuex";
import {IGlobalState} from '@/store';
import {useRouter} from "vue-router";
import UserLogin from '@/components/UserLogin.vue'
import { Menu } from '@element-plus/icons-vue'
import {isMobile} from "@/utils/util";

export default defineComponent({
  name: 'home-header',

  components: {UserLogin, Menu},

  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      // 菜单
      meunList: [
        {
          text: '我的博客',
          value: '/home'
        },
        {
          text: '文章列表',
          value: '/list'
        },
        {
          text: '案例中心',
          value: '/example'
        },
        {
          text: '留言板',
          value: '/message'
        },
        {
          text: '聊天室',
          value: '/chat'
        },
        {
          text: '关于我',
          value: '/aboutme'
        }
      ],
      // 当前页面path路径
      curPath: '/home',
      // 站点标题
      title: computed(() => store.state.app.siteInfo.title),
      // 头部信息
      header: computed(()=>store.state.app.siteInfo.header),
      // 是否移动端
      isMobile: computed(()=>isMobile())
    })


    /**
     * @name: 页面切换
     * @param path 页面path路径
     */
    const switchView = (path: string) => {
      state.curPath = path
      router.replace({path})
    }


    return {
      ...toRefs(state),
      switchView
    }
  }
})
</script>

<style lang="scss" scoped>

.home-header {

  .menu-list {
    position: relative;
    width: 100%;
    height: 100%;

    .menu-item {
      height: 100%;
      width: 10%;
      line-height: 60px;
      cursor: pointer;
      position: relative;
      &.active {
        font-weight: bold;
        &:after{
          position: absolute;
          display: block;
          content: '';
          width: 60%;
          left: 20%;
          height: 4px;
          border-radius: 15px;
          bottom: 2px;
        }
      }
    }
  }
}
</style>
