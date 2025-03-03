import * as API from '@/service'

// 获取用户信息
export const getUserInfoAPI = (params: object) => API.GET('/user/getUserInfo', params)
// 根据用户id获取用户信息
export const getUserInfoByUserId = (params: { userId :string}) => API.GET('/user/getUserInfoByUserId', params)
// 登录
export const loginAPI = (params: { username :string; password :string }) => API.GET('/user/login', params)
// 注册
export const registerAPI = (params: { username :string; password :string;repassword :string }) => API.GET('/user/register', params)
// 退出登录
export const logoutAPI = (params: object) => API.GET('/user/logout', params)
// 修改用户信息
export const updateUserInfoAPI = (params: object) => API.POST('/user/updateUserInfo', params)
// 修改密码
export const updatePasswordAPI = (params: object) => API.POST('/user/updatePassword', params)

