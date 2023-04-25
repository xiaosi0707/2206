<template>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="num" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</template>
<script>
export default {
    props: ['num', 'size', 'total'],
    methods: {
    	// 每页数量发生变化时触发
        handleSizeChange(val) {
        	// 子传父
        	this.$emit('sendSizeChange', val)
        },
        // 当前页数发生变化时触发
        handleCurrentChange(val) {
        	// 子传父
        	this.$emit('sendCurrentChange', val)
        },
    }
}
</script>