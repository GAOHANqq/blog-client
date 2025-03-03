import { Module } from 'vuex';
import {getSiteInfoAPI,editSiteAPI} from '@/service/API/site'
import {ElMessage} from 'element-plus'
import Types from '@/store/action-types'
export interface IAppStore{
    /** socket地址 */
    socketUrl: string;
    /** 站点信息 */
    siteInfo: {
        id: number
        title: string
        icon: string
        theme: string
        header: {
            isShow: boolean
            bg: string
            color: string
        },
        footer: {
            isShow: boolean
            bg: string
            color: string
        }
    };
}
import {addFsUrl} from '@/utils/util'

const state:IAppStore = {
    socketUrl: import.meta.env.VITE_APP_SOCKET_URl,
    siteInfo: {
        id: 0,
        title: '九思小站',
        icon: '',
        theme: '#409eff',
        header: {
            isShow: true,
            bg: '#fff',
            color: '#000'
        },
        footer: {
            isShow: true,
            bg: '#fff',
            color: '#000'
        }
    }
}
const app: Module<any,any> = {
    namespaced: true,
    state: Object.assign({},state),
    mutations: {
        loginIM(state){
            const IM_SERVER_URL = state.socketUrl;
            const loginInfo = {}
            // let loginInfo = { loginUserId: userId, loginToken: userId };
            IMSDK.loginImpl(loginInfo, IM_SERVER_URL, false);
            //收到消息
            IMSDK.callback_showChatMessage = function (p: any) {
                let content: any = {}
                try {
                    content = JSON.parse(p.dataContent);
                } catch (e) {
                    console.error("【非法消息】" + p);
                }

            }
            //登录成功
            IMSDK.callback_afterLoginSucess = function () {
                console.log("【IM服务登录认证成功】");
            };
            //断线重连
            IMSDK.callback_reconnectSucess = function () {
                console.log("【IM服务断线重连成功】");
            };
            //重复登录被踢
            IMSDK.callback_repeatLogin = function () {
                // console.log({message: '您的账号已在别处登录，可能会影响您的使用，请退出后重新登陆！', type: 'error', duration:5000})
            }
        },
        [Types.SET_SITE_INFO](state,siteInfo){
            state.siteInfo = siteInfo || state.siteInfo
            document.documentElement.setAttribute('style', `--el-color-primary: ${state.siteInfo.theme}`)
            document.title = state.siteInfo.title

            if( !state.siteInfo.icon ){
                return
            }
            let oldLink = document.getElementById("dynamic-favicon");
            let link = document.createElement("link");
            link.id = "dynamic-favicon";
            link.rel = "shortcut icon";
            link.href = addFsUrl(state.siteInfo.icon);
            if (oldLink) {
                document.head.removeChild(oldLink);
            }
            document.head.appendChild(link);
        }
    },
    actions: {
        async [Types.GET_SITE_INFO]({commit}){
            getSiteInfoAPI({}).then((res:any)=>{
              if(res.code === 1){
                  commit(Types.SET_SITE_INFO,res.data)
              }
          }).catch((err: any)=>{
              ElMessage.warning(err.msg)
          })
        },
        async [Types.SAVE_SITE_INFO]({commit,dispatch},siteInfo){
            editSiteAPI(siteInfo).then((res:any)=>{
              if(res.code === 1){
                  dispatch(Types.GET_SITE_INFO)
              }
          }).catch((err: any)=>{
              ElMessage.warning(err.msg)
          })
        }
    }
};
export default app;
