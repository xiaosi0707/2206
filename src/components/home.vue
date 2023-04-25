<template>
    <div>
        <!-- <el-skeleton /> -->
        <el-container>
            <!-- 头部 -->
            <el-header >
                <el-row :gutter="20" v-theme="{ background: 'red' }">
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <h3>后台管理系统</h3>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple"></div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <el-button type="info" @click="logout">退出</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <!-- 头部 -->
            <el-container>
                <!-- 侧边 -->
                <el-aside width="200px" >
                    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router >
                        <el-submenu :index="item.id+''" v-for="item in menusList">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{ item.authName }}</span>
                            </template>
                            <el-menu-item :index="'/' + childItem.path" v-for="childItem in item.children">{{ childItem.authName }}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 侧边 -->
                <!-- 二级路由切换容器 -->
                <el-main>
                    <el-breadcrumb class="bread" separator="/" v-if="!breadPath.includes('home')">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ breadParentTitle }}</el-breadcrumb-item>
                        <el-breadcrumb-item><a href="">{{ breadTitle }}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view></router-view>
                </el-main>
                <!-- 二级路由切换容器 -->
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        // 退出
        logout() {
            sessionStorage.clear()
            this.$router.push('/')
        }
    },
    data() {
        return {
            menusList: [],
            breadTitle: '',
            breadPath: ''
        }
    },
    watch: {
        $route: {
            handler(newVal, oldVal) {
                let { meta, matched } = newVal
                this.breadTitle = meta.title
                this.breadParentTitle = meta.parentTitle
                this.breadPath = matched[matched.length - 1].path
                console.log(meta, matched)
            },
            immediate: true
        }
    },
    created() {
        // console.log(this.$route)
        this.$http.get('menus').then(res => {
            let { data, meta } = res.data
            this.menusList = data
        })
    }
}
</script>
<style scoped>
.el-header {
    padding: 0;
}

.el-row {
    background: goldenrod;
    margin-bottom: 20px;
    padding: 10px;
    line-height: 40px;
}

.el-row h3 {
    color: white;
}

.grid-content {
    min-height: 36px;
}
</style>