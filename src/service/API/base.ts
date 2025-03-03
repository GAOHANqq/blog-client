/**
 * description: 通用接口
 **/
import * as API from '@/service'
// 登录
export const Login = (params:any = {}) => API.POST('/mz/baselogin/login', params)
// 注册
export const registerUser = (params:any = {}) => API.POST('/mz/footmark/getImgList', params)

