<template>
  <el-main>
    <el-card
        v-for="item in data"
        :key="item.id"
        class="article-item"
        shadow="hover"
    >
      <el-descriptions :column="1">
        <template #title>
          <el-link :underline="false" @click="goDetail(item.id)"><h2>{{item.title}}</h2></el-link>
        </template>
        <el-descriptions-item v-if="item.sub_title">{{item.sub_title}}</el-descriptions-item>
        <el-descriptions-item >
          {{item.body.substr(0,100)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <p class="flex-start">
            <span class="label">作者：</span>
            <el-link :underline="false" @click="goUserArticle(item.user_id)">{{item.nickname}}</el-link></p>
          <p>
            <span class="label">发表时间：</span>
            {{fromatTime(item.updated_time)}}</p>
          <p>
            <span class="label">阅读次数：</span>
            {{item.views}}</p>
        </el-descriptions-item>
        <el-descriptions-item v-if="item.tag_name && item.category_name">
          <el-space>
            <el-tag v-if="item.category_name">{{item.category_name}}</el-tag>
            <template v-if="item.tag_name">
              <el-tag  type="success" v-for="tag in item.tag_name.split(',')" :key="tag">{{tag}}</el-tag>
            </template>
          </el-space>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <slot name="append"></slot>

  </el-main>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {fromatTime} from '@/utils/util'
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'article-list',

  props: {
    // 文章列表
    data: {
      type: Array,
      default: ()=>[]
    }
  },

  setup() {
    const router = useRouter()

    /**
     * @name: 跳转文件详情
     * @param id 文章id
     */
    const goDetail = (id:string)=>{
      router.push({
        path: '/detail',
        query: {
          id
        }
      })
    }

    const goUserArticle = (userId: string)=>{
      router.replace({
        path: '/userarticle',
        query: {
          userId
        }
      })
    }

    return {
      fromatTime,
      goDetail,
      goUserArticle
    }
  }
})
</script>

<style lang="scss" scoped>
.article-item{
  margin: 10px;
  p{
    color: #acb1b7;
  }
  h2,p{
    margin: 0;
  }
}
</style>
<style lang="scss">
.el-descriptions__cell{
  padding-bottom: 0 !important;
}
.el-descriptions__label{
  display: none;
}
</style>
