import { Module } from 'vuex';
import {ElMessage} from 'element-plus'
import Types from '@/store/action-types'
import {getUserInfoAPI} from '@/service/API/user'
import {USER_TYPE} from '@/utils/enum'

export interface IUserStore{
    /** 用户id */
    id: string
    /** 用户名称 */
    username: string
    /** 用户昵称 */
    nickname: string
    /** 用户简介 */
    intro: string
    /** 用户头像 */
    avatar: string
    /** 用户token */
    token: string
    /** 用户类型 */
    usertype: number
}
const state:IUserStore = {
    id: '',
    username: '',
    nickname: '',
    intro: '',
    avatar: '',
    token: '',
    usertype: USER_TYPE.NORMAL
}
const user: Module<any,any> = {
    namespaced: true,
    state: Object.assign({},state),
    mutations: {
        [Types.SET_USER_INFO](state,userInfo){
            state.id = userInfo.id
            state.username = userInfo.username || ''
            state.nickname = userInfo.nickname || ''
            state.intro = userInfo.intro || ''
            state.avatar = userInfo.avatar || ''
            state.usertype = userInfo.usertype || USER_TYPE.NORMAL
            state.token = userInfo.token || ''
            state.token && ssoClient.setCookie(state.token)
        },
        [Types.LOGOUT](state){
            state.id = ''
            state.username = ''
            state.nickname = ''
            state.intro = ''
            state.avatar = ''
            state.token = ''
            state.usertype = USER_TYPE.NORMAL
            ssoClient.delCookie()
        }
    },
    actions: {
        async [Types.GET_USER_INFO]({commit}){
            getUserInfoAPI({}).then((res:any)=>{
                if(res.code === 1){
                    commit(Types.SET_USER_INFO, res.data)
                }
            }).catch((err: any)=>{
                ElMessage.warning(err.msg)
            })
        },
    }
};
export default user;
