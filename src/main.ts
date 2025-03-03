import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import 'default-passive-events'
import Types from '@/store/action-types'
import installElement from '@/plugins/element-plus'
import installEditor from '@/plugins/v-md-editor'
import "aieditor/dist/style.css"
import '@/assets/css/aieditor-doc.scss'
router.beforeEach((to,from,next)=>{
    if( to.meta && to.meta.requireAuth){
        // 是否登录
        const userId = store.state.user.id
        // 已登录
        if( !userId ){
            // 当前登录是否与上次登录信息一致
            ssoClient.check(true)
        }
        next()
    }else{
        next()
    }
})

const startApp = async ()=>{
    await ssoClient.check(false)
    await store.dispatch(`user/${Types.GET_USER_INFO}`)
    store.dispatch(`app/${Types.GET_SITE_INFO}`)
    const app = createApp(App)
    installElement(app)
    installEditor(app)
    app.use(router).use(store).mount('#app')
}

startApp()
