import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截器 携带token字段
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    // 监听 是否 /refresh_token 是则重置token为刷新token
    const url = config.url
    if (url.split('/').pop() === 'refresh_token') {
      config.headers['Authorization'] = getRefreshToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    //  服务器响应
    const res = response.data
    console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    // 响应失败 做如下
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === -1) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error.response)
    // 拦截网络连接非 200 及 401 响应的错误, eg. Status Code: 500 Internal Server Error
    if (error.response.status !== 200 && error.response.status !== 401) {
      // Message({
      //   message: 'Status Code: ' + error.response.status + ' ' + error.response.statusText,
      //   type: 'error',
      //   duration: 3 * 1000
      console.log('拦截网络连接非 200 及 401 响应的错误')
      // })
      return
    }

    if (error.response.status === 401 && error.response.data.code === 8888) {
      // Message({
      //   message: 'access_token过期,自动续期',
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      console.log(error.response.config)
      return againRequest(error)
    }

    if (error.response.status === 401 && error.response.data.code === 9999) {
      console.log('refresh_token过期 超时......')
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    return Promise.reject(error)
  }
)

async function againRequest(error) {
  await store.dispatch('user/handleCheckRefreshToken') // 同步以获取刷新 access_token 并且保存在 cookie/localstorage
  const config = error.response.config
  config.headers['Authorization'] = getToken()
  config.url = '/' + config.url.split('/').slice(2)
  console.log(config)
  const res = await axios.request(config) // 重新进行原请求
  return res.data // 以error.response.config重新请求返回的数据包是在函数内是 被封装在data里面
}
export default service
