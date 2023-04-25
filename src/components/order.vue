<template>
    <div>
        <!-- 面包屑 -->
        <wyf-bread parentName="订单管理" currentName="订单列表" currentPath="/orders" />
        <el-table :data="ordersList" border style="width: 100%">
            <el-table-column type="index" label="#" width="70">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="180">
            </el-table-column>
            <el-table-column prop="pay_status" label="是否付款">
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货">
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | formatDate }}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-share" size="mini">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 订单列表数据源
            ordersList: [],
            // 请求订单的请求参数
            ordersQuery: {
                query: '',
                pagenum: 1,
                pagesize: 10
            }
        }

    },
    created() {
        this.$http.get('orders', {
            params: this.ordersQuery
        }).then(res => {
            console.log(res)
            let { goods } = res.data.data
            this.ordersList = goods
        })
    }
}
</script>