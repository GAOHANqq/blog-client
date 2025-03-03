<template>
  <div class="aboutme">
    <user-info :userId="1" :size="120" class="user-info"></user-info>
  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import UserInfo from '@/views/modules/UserInfo'

export default defineComponent({
  name: 'aboutme',

  components: {UserInfo}
})
</script>

<style lang="scss" scoped>
.aboutme{
  margin: 20px;
}
</style>
