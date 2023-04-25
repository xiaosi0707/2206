<template>
    <div>
        <!-- 面包屑 -->
        <wyf-bread parentName="商品管理" currentName="商品列表" currentPath="/goods" />
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    <div style="margin-top: 15px;">
                        <search @sendSearch="receiveSearch" />
                        <el-button type="primary">
                            <router-link to="/add">添加商品</router-link>
                        </el-button>
                    </div>
                </span>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="" label="#" width="80" type="index">
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="370">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-share" size="mini">分配角色</el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!-- 分页组件 
                :num   当前第几页
                :size  每页的数量
                :total 数据总条数
                @sendSizeChange 子组件提供的当每页数量发生变化时的钩子函数同时携带一个传递过来的数据（这个数据是当前每页的条数）
                @sendCurrentChange 子组件提供的当当前页数发生变化时的钩子函数同时携带一个传递过来的数据（这个数据是当前的页码）
           -->
            <page :num="goodsQueryInfo.pagenum" :size="goodsQueryInfo.pagesize" :total="total" @sendSizeChange="receiveSizeChange" @sendCurrentChange="receiveCurrentChange" />
        </el-card>
    </div>
</template>
<script>
// 导入分页组件
import Page from './common/page.vue'
import Search from './common/search.vue'
export default {
    components: {
        Page,
        Search
    },
    data() {
        return {
            tableData: [],
            total: 0,
            goodsQueryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            }
        }
    },
    created() {
        this.getUsersList()
    },
    methods: {
        // 搜索
        receiveSearch(val) {
            this.$http.get('goods', {
                params: {
                    query: val,
                    pagenum: 1,
                    pagesize: 10
                }
            }).then(res => {
                let { goods, total } = res.data.data
                this.tableData = goods
                this.total = total
            })
        },
        // 请求用户列表数据
        getUsersList() {
            this.$http.get('goods', {
                params: this.goodsQueryInfo
            }).then(res => {
                let { goods, total } = res.data.data
                this.tableData = goods
                this.total = total
            })
        },
        // 子组件每页数量发生变化时通知父组件重新传递请求参数及重新请求数据
        receiveSizeChange(val) {
            this.goodsQueryInfo.pagesize = val
            this.getUsersList();
        },
        // 子组件当前页码发生变化时通知父组件重新传递请求参数及重新请求数据
        receiveCurrentChange(val) {
            this.goodsQueryInfo.pagenum = val;
            this.getUsersList();
        },
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