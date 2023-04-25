<template>
    <div>
        <!-- 面包屑 -->
        <!-- <wyf-bread>
            <router-link to="/home">首页</router-link> /
            <span>用户管理 / </span>
            <span>用户列表</span>
        </wyf-bread> -->
        <!-- 面包屑 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    <div style="margin-top: 15px;">
                        <!-- 搜索组件 -->
                        <search @sendSearch="receiveSearch" />
                        <el-button type="primary" @click="addDialogFormVisible = true">添加用户</el-button>
                    </div>
                </span>
            </div>
            <el-table :data="usersData" border style="width: 100%" type="index" v-loading="loading">
                <el-table-column label="#" width="80" type="index">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="100">
                </el-table-column>
                <el-table-column prop="mobile" label="电话" width="120">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="updateUserState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-share" size="mini" @click="showRolesDialog(scope.row)">分配角色</el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 
                :num   当前第几页
                :size  每页的数量
                :total 数据总条数
                @sendSizeChange 子组件提供的当每页数量发生变化时的钩子函数同时携带一个传递过来的数据（这个数据是当前每页的条数）
                @sendCurrentChange 子组件提供的当当前页数发生变化时的钩子函数同时携带一个传递过来的数据（这个数据是当前的页码）
           -->
            <page :num="queryInfo.pagenum" :size="queryInfo.pagesize" :total="total" @sendSizeChange="receiveSizeChange" @sendCurrentChange="receiveCurrentChange" />
            <!-- 分页组件 -->
        </el-card>
        <!-- 添加用户模态框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
            <el-form :model="addUserForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户模态框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogFormVisible">
            <el-form :model="editUserForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色模态框 -->
        <el-dialog title="分配角色" :visible.sync="rolesDialogFormVisible">
            <el-form>
                <el-form-item :label-width="formLabelWidth">
                    <p>当前的用户：{{ thisUserInfo.username }}</p>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <p>当前的角色：{{ thisUserInfo.role_name }}</p>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="role in rolesList" :label="role.roleName" :value="role.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rolesDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRoles">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// 导入分页组件
import Page from './common/page.vue'
import Search from './common/search.vue'
// import modalBox from './common/modal-box.vue'
export default {
    components: {
        Page,
        Search,
        // modalBox
    },
    data() {
        return {
            loading: true,
            value: '',
            usersData: [],
            // 添加用户
            addDialogFormVisible: false,
            editDialogFormVisible: false,
            rolesDialogFormVisible: false,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            formLabelWidth: '120px',
            editUserForm: {},
            total: 0,
            rolesList: [],
            thisUserInfo: {}
        }
    },
    created() {
        this.initUsersData()
    },
    methods: {

        // 搜索
        receiveSearch(searchVal) {
            this.$http.get('users', {
                params: {
                    query: searchVal,
                    pagenum: 1,
                    pagesize: 10
                }
            }).then(res => {
                console.log(res)
                let { users, total } = res.data.data
                this.usersData = users
                this.total = total
            })
        },
        // 子组件每页数量发生变化时通知父组件重新传递请求参数及重新请求数据
        receiveSizeChange(val) {
            this.queryInfo.pagesize = val
            this.initUsersData();
        },
        // 子组件当前页码发生变化时通知父组件重新传递请求参数及重新请求数据
        receiveCurrentChange(val) {
            this.queryInfo.pagenum = val;
            this.initUsersData();
        },
        initUsersData() {
            this.$http.get('users', {
                params: this.queryInfo
            }).then(res => {
                console.log(res)
                let { data, meta } = res.data
                this.total = data.total
                this.usersData = data.users
                this.loading = false
            })
        },
        addUser() {
            this.$http.post('users', this.addUserForm).then(res => {
                console.log(res)
                let { data, meta } = res.data
                if (meta.status !== 201) return this.$message.error(meta.msg)
                this.$message.success(meta.msg)
                this.initUsersData()
                this.addDialogFormVisible = false

            })
        },
        delUser(userId) {
            this.$confirm('您要删除该用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 点击确定才执行接口
                this.$http.delete(`users/${userId}`).then(res => {
                    let { data, meta } = res.data
                    if (meta.status === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        showEditDialog(id) {
            this.editDialogFormVisible = true
            // 收集数据
            this.$http.get('users/' + id).then(res => {
                console.log(res)
                if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
                this.editUserForm = res.data.data

            })
            this.editDialogVisible = true
        },
        // 编辑用户
        editUser() {
            this.$http.put(`/users/${this.editUserForm.id}`, {
                email: this.editUserForm.email,
                mobile: this.editUserForm.mobile,
            }).then(res => {
                console.log(res)
                if (res.data.meta.status !== 200) {
                    return this.$message.error(res.data.meta.msg)
                }
                this.$message.success("用户信息更新成功");
                // 重新向服务器发起请求,获取最新用户列表数据
                this.initUsersData();
                // 编辑表单的对话框隐藏
                this.editDialogFormVisible = false;
            })
        },
        // 修改用户状态的方法
        updateUserState(state) {
            console.log(state)
            this.$http.put(`users/${state.id}/state/${state.mg_state}`).then(res => {
                console.log(res)
                if (res.data.meta.status !== 200) {
                    return this.$message.error(res.data.meta.msg);
                } // 状态设置失败了

                this.$message.success('状态设置成功')
            })
        },
        showRolesDialog(userInfo) {
            console.log(userInfo)
            this.thisUserInfo = userInfo
            this.rolesDialogFormVisible = true
            this.$http.get('roles').then(res => {
                console.log(res)
                let { data, meta } = res.data
                this.rolesList = data
            })
        },
        setRoles() {
            this.$http.put(`users/${this.thisUserInfo.id}/role`, {
                rid: this.value
            }).then(res => {
                console.log(res)
                this.getUSersList()
            })
        }
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