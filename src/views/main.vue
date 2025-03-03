<template>
  <el-container class="main-view phone" v-if="isPhone">
    <el-row>
      <el-col>
        <main-weather></main-weather>
      </el-col>
      <el-col>
        <main-report style="width: auto"></main-report>
      </el-col>
      <el-col>
        <div class="btn" @click="goHome">传送门</div>
      </el-col>
      <el-col>
        <main-news></main-news>
      </el-col>
    </el-row>
  </el-container>
  <el-container class="main-view" v-else>
    <el-main style="overflow: hidden">
      <el-row type="flex" align="middle" justify="center" :gutter="60">
        <el-col :span="10">
          <main-weather></main-weather>
        </el-col>
        <el-col :span="14">
          <main-music></main-music>
        </el-col>
      </el-row>
      <main-report></main-report>
      <div class="btn" @click="goHome">传送门</div>
    </el-main>
    <el-aside width="25%" style=" margin-top: 20px;">
      <main-news></main-news>
    </el-aside>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import {useRouter} from "vue-router";
import MainNews from "@/views/modules/Main/MainNews.vue";
import MainWeather from "@/views/modules/Main/MainWeather.vue";
import MainMusic from "@/views/modules/Main/MainMusic.vue";
import MainReport from "@/views/modules/Main/MainReport.vue";
import {isMobile} from "@/utils/util";

export default defineComponent({
  components: {MainNews, MainWeather, MainMusic, MainReport},
  setup() {
    const router = useRouter()
    const isPhone = computed(() => isMobile())
    const goHome = () => {
      const url = router.resolve({
        path: '/home'
      })
      window.open(url.href)
    }

    return {
      isPhone,
      goHome
    }
  }
})
</script>

<style lang="css" scoped>
.main-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 60px;
  background: #86aaca url("https://blog.xjjswh.cn/blogimg/2.jpg") no-repeat center/contain;

  &.phone {
    padding: 0;
    overflow: hidden auto;
    background: #86aaca;

    .el-col {
      margin-top: 20px;
    }

    .btn {
      position: static;
      transform: none;
    }
  }
}

h1 {
  color: #fff;
  margin-top: 150px;
}

.btn {
  padding: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: 300px;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 60px;
  position: fixed;
  font-family: cursive;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, .2);

}

.btn:hover {
  background: rgba(0, 0, 0, .4);
  cursor: pointer;
}
</style>

