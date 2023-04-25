 import Vue from 'vue'
 import Axios from 'axios'
 import { Loading, Message } from 'element-ui'
 // 定义loading变量为空对象null
 let loading = null;
 // axios实例创建
 const AXIOS = Axios.create({
     // 配置前缀公共地址
     baseURL: process.env.VUE_APP_SERVE,
     // 超时配置
     // timeout: 2000
 })
 // 把Axios实例挂载到Vue的原型属性上就可以全局访问axios了
 Vue.prototype.$http = AXIOS
 // 给Axios实例添加请求拦截器
 AXIOS.interceptors.request.use(function(config) {
     // 在每次发送请求之前获取token 查看是否存在
     config.headers.Authorization = sessionStorage.getItem("token")
     // 开启loading
     loading = Loading.service({
         text: '拼了老命加载中...',
         spinner: 'el-icon-video-camera'
     });
     return config;
 }, function(error) {
     // 对请求错误做些什么
     return Promise.reject(error);
 });

 // 添加响应拦截器
 AXIOS.interceptors.response.use(function(response) {
     // 2xx 范围内的状态码都会触发该函数。
     // 对响应数据做点什么
     // 数据成功返回关闭loading
     loading.close()
     console.log(response)
     let { meta } = response.data
     switch (meta.status) {
         case 400:
             Message.error(meta.msg)
             break;
         case 401:
             Message.error(meta.msg)
             break;
         case 403:
             Message.error(meta.msg)
             break;
         case 404:
             Message.error(meta.msg)
             setTimeout(() => window.location.href = "/", 2000)

             break;
         case 422:
             Message.error(meta.msg)
             break;
         case 500:
             Message.error(meta.msg)
             break;
         default:
             Message.success(meta.msg)
     }
     return response;
 }, function(error) {
     if (JSON.stringify(error).includes('timeout')) {
         Message.error('服务器响应超时，请检查网络')
     }
     // 超出 2xx 范围的状态码都会触发该函数。
     // 对响应错误做点什么
     return Promise.reject(error);
 });

 // 对外提供使用的接口
 export default AXIOS