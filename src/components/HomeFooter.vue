<template>
  <el-footer
    class="flex-center"
    :style="{
      backgroundColor: footer.bg
    }"
  >
    <el-space :direction="isMobile?'vertical':'horizontal'">
      <el-link
          :underline="false"
          href="https://beian.miit.gov.cn"
          target="_blank"
          :style="{color: footer.color}"
      >蒙ICP备 20000597号</el-link>
      <el-link
          :underline="false"
          href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=15082202000124"
          target="_blank"
          :style="{color: footer.color}"
      >
        <img :src="addFsUrl('blogimg/police.png')" style="vertical-align: middle;">
        蒙公网安备 15082202000124号</el-link>
    </el-space>
  </el-footer>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from 'vue'
import {useStore} from "vuex";
import {IGlobalState} from '@/store';
import {addFsUrl, isMobile} from "@/utils/util";

export default defineComponent({
  name: 'home-footer',
  setup() {
    const store = useStore<IGlobalState>();
    const state = reactive({
      footer: computed(()=>store.state.app.siteInfo.footer),
      isMobile: computed(()=>isMobile())
    })

    return {
      ...toRefs(state),
      addFsUrl
    }
  }
})
</script>
