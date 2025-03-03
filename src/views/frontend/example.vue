<template>
  <div class="example-view">
    <el-row type="flex" align="center" gutter="30">
      <el-col :span="isMobile?24:6" v-for="item in exampleList" :key="item.id" class="example-item">
        <el-card shadow="hover">
          <a :href="item.link" target="_blank">
            <img :src="addFsUrl(item.src)"/>
            <p>{{ item.name }}</p>
          </a>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, computed} from 'vue'
import {getLinkListAPI} from '@/service/API/site'
import {addFsUrl, isMobile} from '@/utils/util'

export default defineComponent({
  name: 'example',
  setup() {
    const state = reactive({
      // 案例列表
      exampleList: [],
      isMobile: computed(() => isMobile())
    })

    const getLinkList = () => {
      getLinkListAPI({type: 2}).then((res: any) => {
        if (res.code === 1) {
          state.exampleList = res.data
        } else {
          ElMessage.warning(res.msg)
        }
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      })
    }

    onMounted(() => {
      getLinkList()
    })

    return {
      ...toRefs(state),
      addFsUrl
    }
  }
})
</script>

<style lang="scss" scoped>
.example-view {
  padding: 30px;

  .example-item {
    margin-bottom: 20px;
    cursor: pointer;

    img {
      height: 180px;
    }

    a {
      text-decoration: none;
      color: #000;
    }
  }
}
</style>
