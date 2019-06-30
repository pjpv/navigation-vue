/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios"; // 引入axios
import QS from "qs"; // 引入qs模块，用来序列化post类型的数据，后面会提到
import {Message, MessageBox} from "element-ui"

// 创建axios实例
var instance = axios.create({timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const {response} = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      return Promise.reject(response);
    } else {

      Message({
        message: "断网了",
        type: "error",
        duration: 3 * 1000
      })
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明

    }
  });

export default instance;
