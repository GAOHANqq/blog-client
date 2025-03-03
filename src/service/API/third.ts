import * as API from '@/service'

export const wbhotAPI = () => API.FREE_API('https://api.vvhan.com/api/hotlist/wbHot')
export const weatherAPI = () => API.FREE_API('https://api.vvhan.com/api/weather')
// export const musicAPI = (params:{type:string,sort:string}) => API.FREE_API('https://api.vvhan.com/api/wyMusic/热歌榜',params)
export const musicAPI = (params:{type:string,sort:string}) => API.FREE_API('https://api.uomg.com/api/rand.music',params)
export const visitorAPI = () => API.FREE_API('https://api.vvhan.com/api/visitor.info')
export const getMusicLyricAPI = (params: {id:number}) => API.GET('/third/getMusicLyric', params)
export const hitokotoAPI = () => API.FREE_API('https://api.uomg.com/api/rand.qinghua?format=json',{})
export const getSTSTokenAPI = () => API.GET('/oss/getSTSToken',{})



