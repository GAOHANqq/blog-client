<template>
  <el-container v-if="isMobile">
    <el-header>
      <el-tabs v-model="curPath" class="mobile-tab" @tab-click="switchTab">
        <el-tab-pane v-for="(item,index) in menuList" :key="index" :name="item.path">
          <template #label>
            <el-icon v-if="index===0">
              <Paperclip/>
            </el-icon>
            <el-icon v-else-if="index===1">
              <CollectionTag/>
            </el-icon>
            <el-icon v-else-if="index===2">
              <Document/>
            </el-icon>
            <el-icon v-else-if="index===3">
              <Link/>
            </el-icon>
            <el-icon v-else-if="index===4">
              <Management/>
            </el-icon>
            <el-icon v-else>
              <UserFilled/>
            </el-icon>
            {{ item.name }}
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-header>
    <router-view></router-view>
  </el-container>
  <el-container v-else>
    <el-aside width="8%">
      <el-menu
          :default-active="curPath"
          router
      >
        <el-menu-item
            v-for="(item,index) in menuList"
            :key="index"
            :index="item.path"
            :route="{
          path: item.path,
          replace:true
        }"
        >
          <el-icon v-if="index===0">
            <Paperclip/>
          </el-icon>
          <el-icon v-else-if="index===1">
            <CollectionTag/>
          </el-icon>
          <el-icon v-else-if="index===2">
            <Document/>
          </el-icon>
          <el-icon v-else-if="index===3">
            <Link/>
          </el-icon>
          <el-icon v-else-if="index===4">
            <Management/>
          </el-icon>
          <el-icon v-else>
            <UserFilled/>
          </el-icon>
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, computed, reactive, toRefs} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {Paperclip, CollectionTag, Document, UserFilled, Link, Management} from '@element-plus/icons-vue'
import {IGlobalState} from "@/store";
import {USER_TYPE} from '@/utils/enum'
import {isMobile} from "@/utils/util";

export default defineComponent({
  components: {Paperclip, CollectionTag, Document, UserFilled, Link, Management},
  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      // 当前路由
      curPath: router.currentRoute.value.path,
      // 菜单列表
      menuList: computed(() => {
        if (store.state.user.usertype === USER_TYPE.ADMIN) {
          return [
            {name: '分类管理', path: '/admin/category'},
            {name: '标签管理', path: '/admin/tag'},
            {name: '文章管理', path: '/admin/article'},
            {name: '友链管理', path: '/admin/link'},
            {name: '案例管理', path: '/admin/example'},
            {name: '个人信息', path: '/admin/profile'}
          ]
        }
        return [
          {name: '分类管理', path: '/admin/category'},
          {name: '标签管理', path: '/admin/tag'},
          {name: '文章管理', path: '/admin/article'},
          {name: '个人信息', path: '/admin/profile'}
        ]
      }),
      // 是否移动端
      isMobile: computed(() => isMobile())
    })


    const switchTab = (e: any) => {
      const path = e.props.name
      state.curPath = path
      router.replace(state.curPath)
    }

    return {
      ...toRefs(state),
      switchTab
    }
  }
})
</script>

<style lang="scss">
.mobile-tab {
  .el-tabs__nav-wrap {
    display: flex;
    align-items: center;
  }
}
</style>
