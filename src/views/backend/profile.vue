<template>
  <el-main>
    <h2 class="flex-butween">
      个人信息
      <el-button type="primary" @click="goEdit">修改信息</el-button>
    </h2>
    <user-info :userId="userId" :size="150"></user-info>
  </el-main>
</template>

<script lang="ts">
import {defineComponent, computed, reactive,toRefs} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import UserInfo from '@/views/modules/UserInfo'
import {IGlobalState} from "@/store";
import {VIEW_TYPE} from '@/utils/enum'
export default defineComponent({
  components: {UserInfo},
  setup() {
    const router = useRouter()
    const store = useStore<IGlobalState>();
    const state = reactive({
      userId: computed(()=>store.state.user.id)
    })

    const goEdit = ()=>{
      router.push({
        path: '/admin/edit',
        query: {
          id: store.state.user.id,
          type: VIEW_TYPE.PRESION
        }
      })
    }

    return {
      ...toRefs(state),
      goEdit
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
