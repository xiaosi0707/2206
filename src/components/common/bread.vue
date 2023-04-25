<template>
    <el-breadcrumb class="bread" separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ parentName }}</el-breadcrumb-item>
        <el-breadcrumb-item><a :href="currentPath">{{ currentName }}</a></el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name: 'bread',
    props: {
        currentName: {
            type: String
        },
        currentPath: {
            type: String
        },
        parentName: {
            type: String
        }
    }
}
</script>
<style>
.bread {
    margin-bottom: 17px;
}
</style>