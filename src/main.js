import Vue from 'vue'
import App from './App.vue'
import router from './router/router-vuex.js'
import store from './store/index.js'

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,
  //将创建的共享数据对象，挂载在Vue实例；所有的组件都可以直接从store中获取全局共享数据
  store
}).$mount('#app')