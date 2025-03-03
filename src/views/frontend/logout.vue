<template>
  <div class="main-view"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {logoutAPI} from '@/service/API/user'
import {ElMessage} from 'element-plus'
import {getQueryString} from "@/utils/util";

export default defineComponent({
  setup() {
    const logout = () => {
      logoutAPI({}).then((res: any) => {
        if (res.code === 1) {
          const backUrl = getQueryString('back_url')
          if (backUrl) {
            location.replace(backUrl)
          }
        } else {
          ElMessage.warning(res.msg)
        }
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      })
    }

    onMounted(()=>{
      logout()
    })

    return {

    }
  }
})
</script>

<style lang="scss" scoped>

</style>
