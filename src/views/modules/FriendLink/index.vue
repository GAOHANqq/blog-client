<template>
  <el-card class="link-card">
    <el-header class="link-header">
      <h3>友情链接</h3>
    </el-header>

    <el-row class="link-content" type="flex" align="middle" :gutter="20">
      <el-col v-for="item in linkList" :key="item.id" :span="6" class="link-item">
        <a :href="item.link" target="_blank">
          <el-image
              style="width: 100%;height: 80px"
              :src="addFsUrl(item.src)"
              :zoom-rate="1.2"
              fit="contain"
          />
          <h5>{{item.name}}</h5>
        </a>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {defineComponent,  reactive, toRefs, onMounted} from 'vue'
import {getLinkListAPI} from '@/service/API/site'
import {ElMessage} from 'element-plus'
import {addFsUrl} from '@/utils/util'


export default defineComponent({
  name: 'friend-link',

  setup() {
    const state = reactive({
      linkList: []
    })

    const getLinkList = ()=>{
      getLinkListAPI({}).then((res:any)=>{
        if(res.code === 1){
          state.linkList = res.data
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }

    onMounted(()=>{
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
.link-card{
  .link-header{
    line-height: 60px;
    text-align: left;
    color: #fff;
    border-radius: 6px;
    background-color: var(--el-color-primary);
    h3{
      margin: 0;
    }
  }
  .link-content{
    padding-top: 20px;
    text-align: left;
    .link-item{
      cursor: pointer;
      a{
        color: inherit;
        text-decoration: none;
      }
      &:hover{
        h5{
          color: var(--el-color-primary);
        }
      }
      h5{
        text-align: center;
        margin: 5px 0;
      }

    }
  }
}
</style>
