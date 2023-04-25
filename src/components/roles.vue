<template>
    <div>
        <!-- 面包屑 -->
        <!-- <wyf-bread parentName="权限管理" currentName="角色列表" currentPath="/roles" /> -->
        <el-card class="box-card">
            <el-table :data="rolesList" style="width: 100%" border>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <!-- 一级 -->
                            <el-row v-for="item in props.row.children">
                                <el-col :span="3">
                                    <el-tag class="custom-tag" closable @close="delRole(props.row.id, item.id)">{{item.authName}}</el-tag>
                                </el-col>
                                <el-col :span="21">
                                    <!-- 二级 -->
                                    <el-row v-for="item1 in item.children">
                                        <el-col :span="6">
                                            <el-tag class="custom-tag" type="warning" closable @close="delRole(props.row.id, item1.id)">{{ item1.authName }}</el-tag>
                                        </el-col>
                                        <!-- 二级 -->
                                        <el-col :span="18">
                                            <el-tag class="custom-tag" type="danger" closable v-for="item2 in item1.children" @close="delRole(props.row.id, item2.id)">{{ item2.authName }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-share" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="setRole(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
            <!-- 树形组件
    show-checkbox:显示复选框
    node-key:设置选中节点对应的值
    default-expand-all:是否默认展开所有节点
    :default-checked-keys 设置默认选中项的数组
    ref:设置引用 -->
            <el-tree :data="rightsList" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="defKeys" :props="treeProps" default-expand-all ref="treeRef">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRights">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            rolesList: [],
            dialogFormVisible: false,
            rightsList: [],
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中
            defKeys: [],
            // 角色id
            roleId: ''

        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 角色列表数据请求
        getRolesList() {
            this.$http.get('roles').then(res => {
                console.log(res)
                let { data, meta } = res.data
                this.rolesList = data

            })
        },
        delRole(rolesId, rightsId) {
            console.log(rolesId, rightsId)
            /*
                roleId：角色id
                rightId：权限id

             */
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`roles/${rolesId}/rights/${rightsId}`).then(res => {
                    console.log(res)

                    let { meta } = res.data
                    if (meta.status !== 200) return this.$message.error(meta.msg)
                    this.$message.success(meta.msg)
                    this.getRolesList()
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        // 打开权限模态框
        setRole(role) {
            console.log(role)
            this.roleId = role.id
            this.dialogFormVisible = true
            // 树形权限数据请求
            this.$http.get('rights/tree').then(res => {
                console.log(res)
                let { data, meta } = res.data
                this.rightsList = data
                // 每次打开模态框先清空数组（清除之前选中的权限id）
                this.defKeys = []
                // 调用递归方法把树形菜单的权限id push到defKeys数组中
                this.getTreeItem(role)
            })

            // 找第一层的id （笨办法）
            // for (let i = 0; i < role.children.length; i++) {
            //     this.defKeys.push(role.children[i].id)
            //     for (let j = 0; j < role.children[i].children.length; j++) {
            //         this.defKeys.push(role.children[i].children[j].id)
            //         for (let k = 0; k < role.children[i].children[j].children.length; k++) {
            //             this.defKeys.push(role.children[i].children[j].children[k].id)
            //         }
            //     }
            //     console.log(this.defKeys)
            // }


        },
        // 递归遍历权限id
        getTreeItem(role) {
            // 遍历第一层
            role.children.map(item => {
                // 如果还有children继续遍历
                if (item.children) {
                    this.getTreeItem(item)
                } else {
                    // 把找到的id放入到defKeys数组中
                    this.defKeys.push(item.id)
                }
            })
        },
        // 分配权限
        setRights() {
            console.log(this.$refs.treeRef.getCheckedKeys())
            /*
                getCheckedKeys()全选中（父子全部选中）
                getHalfCheckedKeys()部分选中（子选中部分，父下面的没有全部选中）比如商品管理下面包含了商品列表、分类参数、商品分类
            */
            let newArr = this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys())
            // 转成字符串（接口要求）
            const idStr = newArr.join(',')
            this.$http.post(`roles/${this.roleId}/rights`, {
                rids: idStr
            }).then(res => {
                console.log(res)
            })
        }

    }
}
</script>
<style scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.box-card {
    margin-top: 12px;
}

.el-input-group {
    width: 32%;
    margin-right: 12px;
}

.custom-tag {
    margin: 10px;
}
</style>