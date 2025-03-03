
import * as API from '@/service'

// 获取分类列表
export const getCategoryListAPI = (params: object) => API.GET('/category/getCategoryList', params)
// 编辑分类
export const editCategoryAPI = (params: object) => API.POST('/category/editCategory', params)
// 获取分类详情
export const getCategoryByIdAPI = (params: { id:number }) => API.GET('/category/getCategoryById', params)
// 删除单个分类
export const deleteCategory = (params: { id:number }) => API.GET('/category/deleteCategory', params)


