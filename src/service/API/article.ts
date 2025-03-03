import * as API from '@/service'

// 获取文章列表
export const getArticleListAPI = (params: { page:number,limit:number }) => API.GET('/article/getArticleList', params)
// 获取文章详情
export const getArticleDetailAPI = (params: { id:string }) => API.GET('/article/getArticleDetail', params)
// 保存文章预览量
export const saveArticleViewsAPI = (params: { id:string }) => API.GET('/article/saveArticleViews', params)
// 获取相关文章
export const getRelateArticleListAPI = (params: { categoryId:string }) => API.GET('/article/getRelateArticleList', params)
// 获取用户相关列表
export const getUserArticleListAPI = (params: { userId:string }) => API.GET('/article/getUserArticleList', params)
// 编辑文章
export const editArticleAPI = (params: object) => API.POST('/article/editArticle', params)
export const deleteArticleAPI = (params: object) => API.GET('/article/deleteArticle', params)