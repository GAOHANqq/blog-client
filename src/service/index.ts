import axios from 'axios';
import qs from 'qs';
import {ElMessage} from 'element-plus';
import store from '@/store'
const BASE_URL = `/api`
const service = axios.create({
    // 自定义的请求头
    headers: {
      post: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      'X-Requested-Width': 'XMLHttpRequest',
      token: null
    },
    // 超时设置
    timeout: 10*1000,
    // 跨域是否带token
    withCredentials: true,
    responseType: 'json'
  });
// 请求拦截器
service.interceptors.request.use((config:any) => {
        const token = store.state.user.token || ssoClient.getCookie()
        config.headers.token = token;
        if(config.method=="post"){
            config.data = qs.stringify(config.data);
        }
        return config;
    }, (error:any) => {
        return Promise.reject(error);
    })
// 返回状态判断
service.interceptors.response.use((res: any) => {
    let _data = null;
    if (res.code||res.data.code || res.data.code === 0 || res.data.data || res.data.data === 0) {
        switch (res.data.code) {
            case 1:
                _data = res.data;
                break;
            case -1:
                _data = res.data;
                break;
            default:
                _data = res.data;
                break;
        }
    } else {
        _data = res.data;
    }
    return Promise.resolve(_data);
}, (error:any) => {
  try {
      switch (error.response.status) {
          case 400:
              error.message = '请求错误';
              break;
          case 401:
              error.message = '未授权，请登录';
              break;
          case 402:
              error.message = '登录过期，请重新登录';
              break;
          case 403:
              error.message = '拒绝访问';
              break;
          case 404:
              error.message = `请求地址出错: ${error.response.config.url}`;
              break;
          case 408:
              error.message = '请求超时';
              break;
          case 500:
              error.message = '服务器内部错误';
              break;
          case 501:
              error.message = '服务未实现';
              break;
          case 502:
              error.message = '网关错误';
              break;
          case 503:
              error.message = '服务不可用';
              break;
          case 504:
              error.message = '网关超时';
              break;
          case 505:
              error.message = 'HTTP版本不受支持';
              break;
          default:
      }
  } catch (err) {
        console.log(err);
  }
  ElMessage({message: error.message, type: 'error'})
  return Promise.reject(error);
});

export const POST = (url: string, params: object,baseUrl?:string) => {
    let _service: any = service;
    let _baseurl = baseUrl || BASE_URL
    let serviceOptions: any = {
        method: 'post',
        url:_baseurl + url,
        data: params
    };

    return _service(serviceOptions);
};

export const GET = (url: string, params: object,baseUrl?:string) => {
    let _service: any = service;
    let _baseurl = baseUrl || BASE_URL
    let serviceOptions: any = {
        method: 'get',
        url:_baseurl + url,
        params
    };

    return _service(serviceOptions);
};

export const PUT = (url: string, params: object,baseUrl?:string)=>{
    let _baseurl = baseUrl || BASE_URL
    let _service: any = axios.create({
        // 自定义的请求头
        headers: {
            post: {
                'Content-Type': 'multipart/form-data'
            },
            'X-Requested-Width': 'XMLHttpRequest',
        },
        // 超时设置
        timeout: 10*1000,
        responseType: 'json'
    });;
    let serviceOptions: any = {
        method: 'put',
        url:_baseurl + url,
        data: params
    };

    return _service(serviceOptions);
}

export const FREE_API = (url: string,params:any={},type:string="GET")=>{
    for (let key in params) {
        url += `&${key}=${params[key]}`
    }
    url = url.replace('&','?')
    const options = {
        method: type,
        url,
        headers: {'content-type': 'application/json'}
    }
    return axios.request(options).then(function (response:any) {
       return response.data
    }).catch(function () {
        return {
            code: 0
        }
    });
}
