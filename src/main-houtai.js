import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入axios相关配置
import './utils/http.js'

// 导入全局组件
// import Bread from './components/common/bread.vue'
// import CustomBread from './components/common/custom-bread.vue'
// Vue.component('wyf-bread', CustomBread)
// 导入工具函数
import * as globalFunction from './utils/global.js'
// 加载filters.js中所有的对象，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面
import * as filters from './utils/filters.js'
// 导入所有的自定义指令
import * as directives from './utils/directives.js'
//遍历所有导出的过滤器并添加到全局过滤器
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
})
//遍历所有导出的自定义指令并添加成为全局指令
Object.keys(directives).forEach((key) => {
    Vue.directive(key, directives[key]);
})
// 全局函数挂载到Vue原型上
Object.keys(globalFunction).forEach((key) => {
    Vue.prototype[key] = globalFunction[key]
})


// 使用elementUI
Vue.use(ElementUI);

Vue.config.productionTip = false

const vm = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
console.log(`环境对象：${JSON.stringify(process.env)}`)
console.log(`环境：${process.env.NODE_ENV} - ${process.env.VUE_APP_CURRENTMODE} - ${process.env.VUE_APP_SERVE} - ${process.env.VUE_APP_TITLE}`)