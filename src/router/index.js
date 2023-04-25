import Vue from "vue";
import VueRouter from "vue-router";
import App from '../App.vue'

Vue.use(VueRouter);

// 第二步：配置路由规则
const routes = [{
    path: '/',
    component: () => import('../components/login.vue'),
    meta: {
        title: '登陆'
    }
}, {
    path: '/home',
    component: () => import('../components/home.vue'),
    meta: {
        title: '首页'
    },
    children: [{
        path: '/users',
        component: () => import('../components/users.vue'),
        meta: {
            title: '用户列表',
            parentTitle: '用户管理'
        }
    }, {
        path: '/roles',
        component: () => import('../components/roles.vue'),
        meta: {
            title: '角色列表',
            parentTitle: '权限管理'
        }
    }, {
        path: '/goods',
        component: () => import('../components/goods.vue'),
        meta: {
            title: '商品列表',
            parentTitle: '商品管理'
        }
    }, {
        path: '/rights',
        component: () => import('../components/rights.vue'),
        meta: {
            title: '权限列表',
            parentTitle: '权限管理'
        }
    }, {
        path: '/add',
        component: () => import('../components/add.vue'),
        meta: {
            title: '添加商品',
            parentTitle: '商品管理'
        }
    }, {
        path: '/params',
        component: () => import('../components/params.vue'),
        meta: {
            title: '商品参数',
            parentTitle: '商品管理'
        }
    }, {
        path: '/reports',
        component: () => import('../components/reports.vue'),
        meta: {
            title: '数据统计',
            parentTitle: '数据统计'
        }
    }, {
        path: '/orders',
        component: () => import('../components/order.vue'),
        meta: {
            title: '订单列表',
            parentTitle: '订单管理'
        }
    },{
    path: '*',
    redirect: '/home'
}]
}];

// 创建路由实例
const router = new VueRouter({
    mode: 'history',
    base: '/dist/',
    routes, // 把路由配置规则挂载到router实例上面
});

export default router;