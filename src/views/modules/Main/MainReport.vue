<template>
  <el-card
      header="站点统计"
      style="border: none;background: rgba(0,0,0,.15);color: #fff;margin-top: 30px;width: 300px"
  >
    <el-row  type="flex" align="middle" justify="center">
      <el-col>
        <p>博文总数: {{reportInfo.articleCount || 0}}</p>
      </el-col>
      <el-col>
        <p>文章总预览量: {{reportInfo.articleViews || 0}}</p>
      </el-col>
      <el-col>
        <p> 站点访问量: {{reportInfo.siteViews || 0}}</p>
      </el-col>

    </el-row>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import {getSiteReportAPI} from "@/service/API/site";

export default defineComponent({
  name: 'main-report',

  setup() {
    const state = reactive({
      reportInfo: {}
    })

    const getReport = ()=>{
      getSiteReportAPI().then((res:any)=>{
        if(res.code === 1){
          state.reportInfo = res.data
        }
      })
    }

    onMounted(() => {
      getReport()
    })


    return {
      ...toRefs(state)
    }
  }
})
</script>