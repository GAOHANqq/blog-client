<template>
  <el-card
      header="今日天气"
      style="border: none;background: rgba(0,0,0,.15);color: #fff"
      :body-style="{
      height: '300px'
    }"
      v-loading="loading"
  >
    <el-row  type="flex" align="middle">
      <el-col>
        <h2>
          <el-icon style="vertical-align: middle">
            <Location/>
          </el-icon>
          <span style="vertical-align: middle">{{ weatherInfo.city }}</span>
        </h2>
      </el-col>
      <el-col>
        <p>
          <span class="time">{{ time }} <span style="margin-left: 20px">{{ weatherInfo.week }}</span></span>
        </p>
      </el-col>
      <el-col>
        <h2 style="text-align: center">
          <span style="margin-right: 10px">{{ weatherInfo.type }}</span>
          <span>{{ weatherInfo.low }} ~ {{weatherInfo.high}}</span>
        </h2>
      </el-col>
      <el-col :span="12">
        <p>
          <span>风向：{{ weatherInfo.fengxiang }}</span>
          <br/>
          <span>风级：{{ weatherInfo.fengli }}</span>
        </p>
      </el-col>
      <el-col :span="12">
        <p>
          <span>空气质量：{{ weatherInfo.air.aqi_name }}</span>
          <br/>
          <span>pm2.5：{{ weatherInfo.air['pm2.5'] }}</span>
        </p>
      </el-col>
      <el-col @click.native="getHitokoto">
        <h3>
<!--          <span>{{ hitokotoInfo.hitokoto }}</span>-->
          <span>{{ message }}</span>
        </h3>
<!--        <div>《{{hitokotoInfo.from}} <span v-if="hitokotoInfo.from_who">{{hitokotoInfo.from_who}}</span>》</div>-->
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, onBeforeUnmount} from 'vue'
import {weatherAPI,hitokotoAPI} from "@/service/API/third";
import {ElMessage} from "element-plus";
import {Location} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'main-weather',

  components: {Location},

  setup() {
    const state = reactive({
      weatherInfo: {
        air: {}
      } as any,
      hitokotoInfo: {} as any,
      loading: true,
      time: '',
      timer: 0,
      message: ''
    })
    const getWeather = () => {
      state.loading = true
      weatherAPI().then((res: any) => {
        state.weatherInfo = {...res,...res.data}
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      }).finally(() => {
        state.loading = false
      })
    }
    const getHitokoto = () => {
      hitokotoAPI().then((res: any) => {
        state.message = res.content
      }).catch((err: any) => {
        ElMessage.warning(err.msg)
      })
    }

    const setNowTime = ()=>{
      const date = new Date
      const YY = date.getFullYear()
      const MM = date.getMonth() + 1
      const DD = date.getDate()
      const HH = date.getHours()
      const mm = date.getMinutes()
      const ss = date.getSeconds()

      let time = ''
      time += [YY,MM,DD].map((item:number)=>{
        return item >= 10  ? item : '0' + item
      }).join('-')
      time += ' '
      time += [HH,mm,ss].map((item:number)=>{
        return item >= 10  ? item : '0' + item
      }).join(':')
      state.time = time
    }

    const clearTimer = ()=>{
      clearInterval(state.timer)
      state.timer = 0
    }

    const setDate = ()=>{
      setNowTime()
      clearTimer()
      state.timer = setInterval(()=>{
        setNowTime()
      },1000)
    }

    onMounted(() => {
      setDate()
      getWeather()
      getHitokoto()
    })
    onBeforeUnmount(()=>{
      clearTimer()
    })

    return {
      ...toRefs(state),
      getHitokoto
    }
  }
})
</script>

<style lang="scss" scoped>
  p{
    margin-bottom: 0;
  }
  h2{
    margin-bottom: 0;
  }
  .time{
    margin-left: 20px;
    font-size: 20px;
    font-family: mind-demi-bold;
    font-weight: 600;
    vertical-align: middle;
  }
</style>
