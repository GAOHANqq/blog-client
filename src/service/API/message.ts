import * as API from '@/service'
// 留言板列表
export const getMessageListAPI = (params:object) => API.POST('/message/getMessageList', params)
// 删除留言
export const deleteMessageAPI = (params:object) => API.POST('/message/deleteMessage', params)
// 编辑留言留言
export const editMessageAPI = (params:object) => API.POST('/message/editMessage', params)