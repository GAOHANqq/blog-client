import * as API from '@/service'

// 获取用户信息
export const getSiteInfoAPI = (params:any = {}) => API.GET('/site/getSiteInfo', params)
// 编辑站点信息
export const editSiteAPI = (params:any = {}) => API.POST('/site/editSite', params)
// 获取友情链接列表
export const getLinkListAPI = (params:any = {}) => API.GET('/site/getLinkList', params)
// 删除友链
export const deleteLinkAPI = (params:any = {}) => API.GET('/site/deleteLink', params)
// 获取友链详情
export const getLinkByIdAPI = (params:any = {}) => API.GET('/site/getLinkById', params)
// 编辑友链
export const editLinkAPI = (params:any = {}) => API.POST('/site/editLink', params)
// 添加访客信息
export const addVisitorAPI = (params:any = {}) => API.POST('/site/addVisitor', params)
// 添加站点访问量
export const addViewsAPI = (params:any = {}) => API.POST('/data/addViews', params)
// 获取站点统计数据
export const getSiteReportAPI = (params:any = {}) => API.POST('/data/getSiteReport', params)
// 上传文件
export const uploadFileAPI = (params:any = {},url:string) => API.PUT('/oss/uploadFile', params,url)
export const getSTSTokenAPI = (params:any = {}) => API.GET('/oss/getSTSToken', params)

