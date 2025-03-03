<template>
  <el-upload
      ref="uploadRef"
      action="#"
      :accept="accept"
      :format="format"
      :show-file-list="false"
      :auto-upload="false"
      :limit="1"
      :before-upload="beforeUpload"
      :http-request="uploadFile"
      :on-change="fileChange"
  >
    <el-button type="primary">{{ title }}</el-button>
  </el-upload>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {ElMessage} from "element-plus";
import {getFilePath} from '@/utils/util'
import ossUpload from "@/utils/ossUpload";

export default defineComponent({
  name: 'js-upload',

  emits: ['on-upload'],

  props: {
    //上传类型
    accept: {
      type: String,
      default: 'image/*'
    },
    // 上传格式
    format: {
      type: Array,
      default: ['jpg', 'jpeg', 'png', 'ico']
    },
    title: {
      type: String,
      default: '上传文件'
    }
  },

  setup(props, ctx) {
    const uploadRef = ref<any>(null);

    /**
     * @name: 上传前校验
     * @param file 文件对象
     * @return 校验是否通过
     */
    const beforeUpload = (file: File): boolean => {
      if (!/jpg|jpeg|png|ico/.test(file.type)) {
        ElMessage.warning('图片格式错误');
        return false;
      }
      return true;
    };
    /**
     * @name: 添加文件
     * @param file 文件对象
     */
    const fileChange = () => {
      uploadRef.value.submit();
    };

    /**
     * @name: 上传文件
     */
    const uploadFile = async (target: any) => {
      const file = target.file
      const filePath = getFilePath(file);
      ossUpload.uploadFile(file, filePath).then((res: any) => {
        ctx.emit('on-upload', res[0])
      })
      uploadRef.value.clearFiles()
    };

    return {
      uploadRef,
      beforeUpload,
      uploadFile,
      fileChange
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
