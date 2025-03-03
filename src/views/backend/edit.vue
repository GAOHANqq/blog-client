<template>
  <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
  >

    <template v-if="type === VIEW_TYPE.PRESION">
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="form.nickname" show-word-limit :maxlength="10" placeholder="请输入昵称" clearable style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="简介：" prop="intro">
        <el-input
            type="textarea"
            v-model="form.intro"
            placeholder="请输入简介"
            clearable
            style="width: 50%"
            show-word-limit
            :maxlength="300"
            :autosize="{ minRows: 2, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像：" prop="avatar">
        <el-image
            style="width: 100px; height: 100px;margin-right: 10px"
            :src="addFsUrl(form.avatar)"
            :zoom-rate="1.2"
            :preview-src-list="[addFsUrl(form.avatar)]"
            fit="cover"
        />
        <js-upload @on-upload="onUpload($event,VIEW_TYPE.PRESION)"></js-upload>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" show-word-limit :maxlength="15" placeholder="请输入标题" clearable style="width: 50%"></el-input>
      </el-form-item>

      <template v-if="type===VIEW_TYPE.LINK">
        <el-form-item label="友链地址：" prop="link">
          <el-input v-model="form.link" placeholder="请输入友链地址" clearable style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="友链图标：" prop="avatar">
          <el-image
              style="width: 100px; height: 100px;margin-right: 10px"
              :src="addFsUrl(form.src)"
              :zoom-rate="1.2"
              :preview-src-list="[addFsUrl(form.src)]"
              fit="cover"
          />
          <js-upload @on-upload="onUpload($event,VIEW_TYPE.LINK)"></js-upload>
        </el-form-item>
      </template>
      <template v-else-if="type===VIEW_TYPE.EXAMPLE">
        <el-form-item label="案例地址：" prop="link">
          <el-input v-model="form.link" placeholder="请输入友链地址" clearable style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="案例图标：" prop="avatar">
          <el-image
              style="width: 100px; height: 100px;margin-right: 10px"
              :src="addFsUrl(form.src)"
              :zoom-rate="1.2"
              :preview-src-list="[addFsUrl(form.src)]"
              fit="cover"
          />
          <js-upload @on-upload="onUpload($event,VIEW_TYPE.EXAMPLE)"></js-upload>
        </el-form-item>
      </template>

      <template v-else-if="type===VIEW_TYPE.ARTICLE">
        <el-form-item label="副标题：" prop="subtitle">
          <el-input v-model="form.subtitle" show-word-limit :maxlength="15" placeholder="请输入副标题" clearable style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="分类：" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option :label="item.name" :value="item.id" v-for="item in categoryList" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标签：" prop="tag">
          <el-checkbox-group v-model="checkedTagList">
            <el-checkbox
                :label="item.id"
                v-for="item in tagList" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="切换编辑器：" >
          <el-switch
              v-model="isAiEditor"
              active-text="aieditor"
              inactive-text="v-md-editor">
          </el-switch>
        </el-form-item>
        <el-form-item label="文章内容：" prop="body">
          <ai-editor v-if="isAiEditor" :content="form.body" @on-change="onChange"></ai-editor>

          <v-md-editor
              v-else
              v-model="form.body"
              height="500px"
              left-toolbar="undo redo clear | tip emoji | h bold italic strikethrough quote | ul ol table hr | link image code"
              :disabled-menus="[]"
              @upload-image="uploadImage"
          ></v-md-editor>
        </el-form-item>
      </template>
    </template>

  </el-form>

  <el-footer>
    <el-button @click="onCancel">取消</el-button>
    <el-button type="primary" @click="onConfirm">提交</el-button>
  </el-footer>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import {useRouter} from "vue-router";
import {VIEW_TYPE,IINK_TYPE} from '@/utils/enum'
import {getCategoryListAPI,editCategoryAPI,getCategoryByIdAPI} from '@/service/API/category'
import {getTagListAPI,editTagAPI,getTagByIdAPI} from '@/service/API/tag'
import {editArticleAPI,getArticleDetailAPI} from '@/service/API/article'
import {updateUserInfoAPI,getUserInfoByUserId} from '@/service/API/user'
import {editLinkAPI,getLinkByIdAPI} from '@/service/API/site'
import {ElMessage} from 'element-plus'
import {IGlobalState} from "@/store";
import {useStore} from "vuex";
import jsUpload from '@/components/JsUpload'
import {removeFsUrl,addFsUrl,getFilePath} from '@/utils/util'
import ossUpload from "@/utils/ossUpload";
import AiEditor from "@/components/AiEditor.vue";
export default defineComponent({
  name: 'edit',

  components: {
    jsUpload,
    AiEditor
  },

  props: {
    // 业务id
    id: {
      type: String,
      default: ''
    },
    // 业务类型
    type: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore<IGlobalState>();
    const formRef = ref<any>(null)
    const router = useRouter()
    const state = reactive({
      form: {
        title: '',
        subtitle: '',
        categoryId: '',
        categoryName: '',
        tagId: '',
        tagName: '',
        body: '',

        nickname: '',
        intro: '',
        avatar: '',

        link: '',
        src: '',

        type: IINK_TYPE.FRIND
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
          { max: 15, message: '最多支持输入15个文字', trigger: 'change' }
        ],
        subtitle: [
          { required: true, message: '请输入副标题', trigger: 'change' },
          { max: 15, message: '最多支持输入15个文字', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        body: [
          { required: true, message: '请输入文字内容', trigger: 'change' },
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'change' },
          { max: 10, message: '最多支持输入10个文字', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入简介', trigger: 'change' },
          { max: 300, message: '最多支持输入300个文字', trigger: 'change' }
        ],
        link: [
          { required: true, message: '请输入友链地址', trigger: 'change' },
          { max: 50, message: '最多支持输入50个文字', trigger: 'change' }
        ],
        src: [
          { required: true, message: '请上传友链图标', trigger: 'change' },
        ],
      },
      apiParams: {
        limit: 10,
        page: 1
      },
      categoryList: [],
      tagList: [],
      checkedTagList: [],
      isAiEditor: false
    })


    const onCancel = ()=>{
      router.back()
    }
    const onConfirm = async ()=>{

      formRef.value.validate((valid:boolean)=>{
        if( valid ) {
          saveResult()
        }
      })
    }
    const saveResult = ()=>{
      switch (props.type) {
        case VIEW_TYPE.ARTICLE:
          editArticle()
          break
        case VIEW_TYPE.CATEGORY:
          editCategory()
          break
        case VIEW_TYPE.TAG:
          editTag()
          break
        case VIEW_TYPE.LINK:
        case VIEW_TYPE.EXAMPLE:
          editLink()
          break
        case VIEW_TYPE.PRESION:
          updateUserInfo()
          break
      }
    }

    const getDetail = ()=>{
      switch (props.type) {
        case VIEW_TYPE.ARTICLE:
          getArticleDetail()
          break
        case VIEW_TYPE.CATEGORY:
          getCategoryById()
          break
        case VIEW_TYPE.TAG:
          getTagById()
          break
        case VIEW_TYPE.LINK:
        case VIEW_TYPE.EXAMPLE:
          getLinkById()
          break
        case VIEW_TYPE.PRESION:
          getUserInfoDetail()
          break
      }
    }


    const getCategoryList = ()=>{
      getCategoryListAPI({
        userId: store.state.user.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.categoryList = res.data
          state.form.categoryId = res.data[0].id
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const getCategoryById = ()=>{
      getCategoryByIdAPI({
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.form.title = res.data.name
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const editCategory = ()=>{
     return editCategoryAPI({
       name: state.form.title,
       id: props.id
     }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success(props.id?'编辑成功!':'添加成功!')
          onCancel()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }

    const getTagList = ()=>{
      getTagListAPI({
        ...state.apiParams,
        userId: store.state.user.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.tagList = res.data.rows
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const editTag = ()=>{
      return editTagAPI({
        name: state.form.title,
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success(props.id?'编辑成功!':'添加成功!')
          onCancel()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const getTagById = ()=>{
      getTagByIdAPI({
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.form.title = res.data.name
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }


    const editLink = ()=>{
      return editLinkAPI({
        name: state.form.title,
        link: state.form.link,
        src: removeFsUrl(state.form.src),
        id: props.id,
        type: state.form.type
      }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success(props.id?'编辑成功!':'添加成功!')
          onCancel()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const getLinkById = ()=>{
      getLinkByIdAPI({
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.form.title = res.data.name
          state.form.link = res.data.link
          state.form.src = res.data.src
          state.form.type = res.data.type
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }

    const editArticle = ()=>{
      return editArticleAPI({
        title: state.form.title,
        subtitle: state.form.subtitle,
        categoryId: state.form.categoryId,
        body: state.form.body,
        tagId: state.checkedTagList.toString(),
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success(props.id?'编辑成功!':'添加成功!')
          onCancel()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const getArticleDetail = ()=>{
      getArticleDetailAPI({
        id: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.form = {
            title: res.data.title,
            subtitle: res.data.sub_title,
            categoryId: res.data.category_id,
            categoryName: res.data.category_name,
            tagId: res.data.tag_id,
            tagName: res.data.tag_name,
            body: res.data.body,
            nickname: res.data.nickname,
            intro: '',
            link: '',
            src: '',
          }
          state.checkedTagList = res.data.tag_id.split(',').map((id:string)=>parseInt(id))
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }


    const updateUserInfo = ()=>{
      return updateUserInfoAPI({
        nickname: state.form.nickname,
        intro: state.form.intro,
        avatar: removeFsUrl(state.form.avatar)
      }).then((res:any)=>{
        if(res.code === 1){
          ElMessage.success(props.id?'编辑成功!':'添加成功!')
          if( store.state.user.id == props.id ){
              store.state.user.nickname = state.form.nickname
              store.state.user.intro = state.form.intro
              store.state.user.avatar = state.form.avatar
          }
          onCancel()
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const getUserInfoDetail = ()=>{
      getUserInfoByUserId({
        userId: props.id
      }).then((res:any)=>{
        if(res.code === 1){
          state.form.nickname = res.data.nickname
          state.form.intro = res.data.intro
          state.form.avatar = res.data.avatar
        }else{
          ElMessage.warning(res.msg)
        }
      }).catch((err: any)=>{
        ElMessage.warning(err.msg)
      })
    }
    const onUpload = (url:string,type: VIEW_TYPE)=>{
      if( type === VIEW_TYPE.PRESION ){
        state.form.avatar = url
      }else{
        state.form.src = url
      }
    }

    const onChange = (body)=>{
      state.form.body = body
    }

    const uploadImage = (event:any, insertImage:Function, files:File[])=>{
      const file = files[0]
      const filePath = getFilePath(file);
      ossUpload.uploadFile(file,filePath).then((res:any)=>{
        insertImage({url: res[0]});
      })
    }

    const init = ()=>{
      state.form = {
        title: '',
        subtitle: '',
        categoryId: '',
        categoryName: '',
        tagId: '',
        tagName: '',
        body: '',
        nickname: '',
        avatar: '',
        intro: '',
        link: '',
        src: '',
        type: IINK_TYPE.FRIND
      }
      state.categoryList = []
      state.tagList = []
      state.checkedTagList = []
      switch (props.type) {
        case VIEW_TYPE.ARTICLE:
          getCategoryList()
          getTagList()
          break
        case VIEW_TYPE.CATEGORY:
          break
        case VIEW_TYPE.TAG:
          break
        case VIEW_TYPE.PRESION:
          break
      }
    }

    onMounted(()=>{
      init()
      // 编辑
      if( props.id ){
          getDetail()
      }
    })

    return {
      ...toRefs(state),
      formRef,
      VIEW_TYPE,
      addFsUrl,
      onCancel,
      onConfirm,
      onUpload,
      uploadImage,
      onChange
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
