<template>
    <div>
        <!-- 面包屑 -->
        <!-- <wyf-bread parentName="权限管理" currentName="权限列表" currentPath="/rights" /> -->
        <el-card class="box-card">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="#" width="180">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称" width="180">
                </el-table-column>
                <el-table-column prop="path" label="路径" width="180">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                    	
                        <el-tag type="primary" v-if="scope.row.level === '0'">一级</el-tag>
                         <el-tag type="warning" v-else-if="scope.row.level === '1'">二级</el-tag>
                        <el-tag type="danger" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    },
    created() {
        this.$http.get('rights/list').then(res => {
            console.log(res)
            let { data, meta } = res.data
            this.tableData = data
        })
    }
}
</script>
<style scoped>
.box-card {
    margin-top: 12px;
}

.el-input-group {
    width: 32%;
    margin-right: 12px;
}
</style>