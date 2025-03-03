<template>
  <el-dialog title="站点设置" v-model="isShow" width="35%" @close="onCancle">
    <el-form
        :model="siteInfo"
        :rules="rules"
        ref="ruleFormRef"
        label-width="150px"
    >
      <el-form-item label="站点名称：" prop="title" required>
        <el-input
            v-model="siteInfo.title"
            placeholder="请输入站点名称"
        ></el-input>
      </el-form-item>
      <!--地址-->
      <el-form-item label="站点ico：">
        <el-image
            style="width: 100px; height: 100px;margin-right: 10px"
            :src="addFsUrl(siteInfo.icon)"
            :zoom-rate="1.2"
            :preview-src-list="[addFsUrl(siteInfo.icon)]"
            fit="cover"
        />
        <js-upload @on-upload="onUpload"></js-upload>
      </el-form-item>
      <el-form-item label="主题色：">
        <el-color-picker v-model="siteInfo.theme" show-alpha :predefine="predefineColors"/>
      </el-form-item>
      <el-form-item label="页眉：">
        <el-row type="flex" align="middle" style="height: 50px;width: 100%">
          <el-col :span="12" class="flex-center">
            <span class="label" style="margin-right: 5px">展示:</span>
            <el-radio-group v-model="siteInfo.header.isShow">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6" class="flex-center">
            <span class="label" style="margin-right: 5px">背景色:</span>
            <el-color-picker v-model="siteInfo.header.bg"></el-color-picker>
          </el-col>
          <el-col :span="6" class="flex-center">
            <span class="label" style="margin-right: 5px">字体色:</span>
            <el-color-picker v-model="siteInfo.header.color"></el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="页尾：">
        <el-row type="flex" align="middle" style="height: 50px;width: 100%">
          <el-col :span="12" class="flex-center" style="text-align: left">
            <span class="label" style="margin-right: 5px">展示:</span>
            <el-radio-group v-model="siteInfo.footer.isShow">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="6" class="flex-center" style="text-align: left">
            <span class="label" style="margin-right: 5px">背景色:</span>
            <el-color-picker v-model="siteInfo.footer.bg"></el-color-picker>
          </el-col>
          <el-col :span="6" class="flex-center">
            <span class="label" style="margin-right: 5px">字体色:</span>
            <el-color-picker v-model="siteInfo.footer.color"></el-color-picker>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancle">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import {useStore} from "vuex";
import Types from '@/store/action-types'
import {removeFsUrl, addFsUrl} from '@/utils/util'
import JsUpload from '@/components/jsUpload.vue'

export default defineComponent({
  name: 'site-config',

  emits: ['on-cancel'],

  components: {JsUpload},

  setup(props, ctx) {
    const store = useStore<IGlobalState>();
    const state = reactive({
      // 预定义颜色
      predefineColors: [
        '#fd032f',
        '#14d6dc',
        '#ff921c',
        '#4a94ff',
        '#1abc9c',
        '#945afe',
        '#0caac1'
      ],
      // 表单参数
      siteInfo: {
        title: store.state.app.siteInfo.title,
        icon: store.state.app.siteInfo.icon,
        theme: store.state.app.siteInfo.theme,
        footer: store.state.app.siteInfo.footer,
        header: store.state.app.siteInfo.header
      },
      //表单校验规则
      rules: {
        title: [
          {required: true, message: "请输入站点名称", trigger: "blur"},
          {max: 20, message: "名称不超过20个字", trigger: "blur"},
        ],
      },
      // 是否展示
      isShow: true
    })
    /**
     * @name: 颜色切换
     * @param theme 当前颜色,为null时表示清空
     */
    const switchColor = (theme: string | null) => {
      if (theme === null) {
        state.curColor = store.state.app.siteInfo.theme
      } else {
        state.curColor = theme
      }
    }
    /**
     * @name: 确认站点设置
     */
    const onConfirm = () => {
      const params = {
        ...state.siteInfo,
        footer: JSON.stringify(state.siteInfo.footer),
        header: JSON.stringify(state.siteInfo.header),
        id: store.state.app.siteInfo.id,
        icon: removeFsUrl(state.siteInfo.icon)
      }
      store.dispatch(`app/${Types.SAVE_SITE_INFO}`, params)
      onCancle()
    }
    /**
     * @name: 取消站点设置
     */
    const onCancle = () => {
      ctx.emit('on-cancel')
    }

    const onUpload = (url: string) => {
      state.siteInfo.icon = url
    }


    return {
      ...toRefs(state),
      addFsUrl,
      switchColor,
      onCancle,
      onConfirm,
      onUpload
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
