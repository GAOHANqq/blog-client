
import * as API from '@/service'

// 获取文章列表
export const getHotTagListAPI = (params: object) => API.GET('/tag/getHotTagList', params)

export const getTagListAPI = (params: object) => API.GET('/tag/getTagList', params)
export const editTagAPI = (params: { id?:number,name: string }) => API.POST('/tag/editTag', params)
export const getTagByIdAPI = (params: { id:number }) => API.GET('/tag/getTagById', params)
export const deleteTagAPI = (params: { id:number }) => API.GET('/tag/deleteTag', params)

