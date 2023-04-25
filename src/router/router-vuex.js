import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 第二步：配置路由规则
const routes = []

// 创建路由实例
const router = new VueRouter({
    routes, // 把路由配置规则挂载到router实例上面
});

export default router;