<template>
  <home-header v-if="header.isShow && !isMain"></home-header>
  <div style="minHeight: calc(100% - 130px)" @mousemove="mousemove">
    <router-view></router-view>
  </div>
  <home-footer v-if="footer.isShow && !isMain"></home-footer>

  <el-backtop :right="100" :bottom="100" target="#app"/>

  <div class="cn-btn" v-show="isShowMenu">
    <el-switch
        v-model="isShowCN"
        :active-text="isShowCN?'关闭粒子':'开启粒子'"
        @change="onChange"
    />
  </div>

</template>


<script lang="ts">
import {computed, defineComponent, toRefs, reactive, ref, onMounted, onBeforeUnmount} from "vue";
import HomeHeader from "@/components/HomeHeader.vue";
import HomeFooter from "@/components/HomeFooter.vue";
import {useStore} from "vuex";
import {IGlobalState} from '@/store';
import CanvasNest from 'canvas-nest.js';
import {useRouter} from "vue-router";
import {visitorAPI} from "@/service/API/third";
import {addViewsAPI, addVisitorAPI} from "@/service/API/site";

export default defineComponent({
  components: {HomeHeader, HomeFooter},

  setup() {
    const canvasRef = ref<any>(null)
    const store = useStore<IGlobalState>();
    const router = useRouter()
    const state = reactive({
      header: computed(() => store.state.app.siteInfo.header),
      footer: computed(() => store.state.app.siteInfo.footer),
      isMain: computed(() => ['/', '/main','/sso'].includes(router.currentRoute.value.path)),
      cnClient: null,
      isShowMenu: false,
      isShowCN: false,
    })


    const destroy = () => {
      state.cnClient && state.cnClient.destroy()
      state.cnClient = null
    }

    const start = () => {
      state.cnClient = new CanvasNest(document.body, {
        colors: ['#fd032f', '#409EFF', 'rgba(148, 90, 254, 1)'],
        count: 200,
        opacity: .9,
        zIndex: 0
      });
    }

    const mousemove = (e: any) => {
      state.isShowMenu = window.innerWidth - e.screenX <= 200
    }

    const onChange = () => {
      if (state.isShowCN) {
        start()
      } else {
        destroy()
      }
    }

    const setVisitor = () => {
      visitorAPI().then((res: any) => {
        const {browser, browser_ver: version, ip, location, system, week, time} = res
        const params = {
          browser,
          version,
          ip,
          location,
          system,
          week,
          time
        }
        addVisitorAPI(params)
      })
      addViewsAPI()
    }


    onMounted(() => {
      setVisitor()
      onChange()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      ...toRefs(state),
      canvasRef,
      mousemove,
      onChange,
    }
  }
})
</script>


<style lang="scss">
html, body {
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-y: auto;
  overflow-x: hidden;
}

.cn-btn {
  position: fixed !important;
  top: 50px;
  right: 6px;
  z-index: 1;
}
</style>
