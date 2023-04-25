<template>
    <div>
        <!-- 面包屑 -->
        <wyf-bread parentName="商品管理" currentName="分类参数" currentPath="/goods" />
       
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    <div style="margin-top: 15px;">
                        <!-- 商品分类 
                                :cat-data 数据源
                                :cat-props 显示字段的配置
                                :cat-current 把当前选中的分类对象传递给子组件通过子组件中的v-model取到当前选中的分类id
                            -->
                        {{ selectedCatObj.goods_cat }}
                        <cat :cat-current="selectedCatObj" :cat-data="classifyList" :cat-props="props" />
                    </div>
                </span>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 第一个tab -->
                <el-tab-pane label="动态参数" name="first">
                    <el-button type="primary" size="mini" @click="manyDialogFormVisible=true">添加参数</el-button>
                    <el-table :data="manyAttrs" border class="custom-table">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <!-- 属性的参数值 -->
                                <el-form label-position="left" inline class="demo-table-expand">
                                    {{ props.row }}
                                    <!-- 渲染tag 由于接口返回的attr_vals是字符串要想遍历就得转成数组-->
                                    <el-tag v-for="item in props.row.attr_vals" closable :disable-transitions="false">
                                        {{ item }}
                                    </el-tag>
                                    <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model="props.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column label="属性名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 第二个tab -->
                <el-tab-pane label="静态属性" name="second">
                    <el-button type="primary" size="mini">添加属性</el-button>
                    <el-table :data="onlyAttrs" border class="custom-table">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <!-- 属性的参数值 -->
                                <el-form label-position="left" inline class="demo-table-expand">
                                    {{ props.row }}
                                    <!-- 渲染tag 由于接口返回的attr_vals是字符串要想遍历就得转成数组-->
                                    <el-tag v-for="item in props.row.attr_vals" closable :disable-transitions="false">
                                        {{ item }}
                                    </el-tag>
                                    <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model="props.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(props.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column label="属性名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 模态框添加动态参数 -->
        <el-dialog title="添加参数" :visible.sync="manyDialogFormVisible">
            <el-form>
                <el-form-item label="参数名" :label-width="formLabelWidth">
                    <el-input v-model="manyVal" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="manyDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addManyAttrs">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Cat from './common/cat.vue'
export default {
    components: {
        Cat
    },
    data() {
        return {
            // 分类数据源
            classifyList: [],
            // 分类字段配置
            props: {
                // 级联菜单触发方式
                expandTrigger: 'hover',
                // 展示给用户的字段
                label: 'cat_name',
                value: 'cat_id'
            },
            // 选中的分类
            selectedCatObj: {
                goods_cat: ''
            },
            // 动态参数
            manyAttrs: [],
            // 静态参数
            onlyAttrs: [],
            // tabs默认选中哪一个
            activeName: 'first',
            // 动态参数的值
            manyVal: '',
            formLabelWidth: '120px',
            // 添加动态参数模态框
            manyDialogFormVisible: false,
            dynamicTags: ['标签一'],

            arrTags: []

        };
    },
    created() {
        // 请求分类接口
        this.$http.get(`categories`).then(res => {
            let { data, meta } = res.data
            this.classifyList = data
        })
    },
    methods: {
        // tag组件的
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        // tab组件的
        showInput(obj) {
            // 当前tag隐藏Input显示变成可编辑状态
            obj.inputVisible = true;
            // DOM节点更新之后再获取焦点否则获取不到因此必须使用$nextTick方法
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // enter调用添加静态或动态参数值的方法，这个方法是动态参数和静态参数公用的他们不同的区别在于请求参数attr_sel的不同
        handleInputConfirm(objAttr) {
            // 通过传参拿到请求接口需要的两个参数
            let { attr_id, attr_sel, attr_name, attr_vals, inputValue, inputVisible } = objAttr
            if (inputValue.trim().length <= 0) {
                inputValue = ''
                inputVisible = false
                return
            }
            // 获取到用户输入的内容，并保存到attr_vals中
            attr_vals.push(inputValue)


            // 请求添加动态参数的接口
            /*
                id：分类id -> 级联选择器已经选过了这个是现成的selectedCatArr:[]
                attr_id：属性id -> 通过scope.row作为参数传递进来在执行handleInputConfirm这个方法的时候
                attr_name：版式/内存/cpu主频
                attr_sel：属性类型many/only
                attr_vals：参数的属性值
            */
            this.$http.put(`categories/${this.selectedCatObj.goods_cat[this.selectedCatObj.goods_cat.length - 1]}/attributes/${attr_id}`, {
                attr_name,
                attr_sel,
                attr_vals: attr_vals.join(' ') // 接口文档要求转为字符串
            }).then(res => {
                console.log(res)
                // 再次请求动态参数数据
                let { meta, data } = res.data
                if (meta.status !== 200) return this.$message.error(meta.msg)
                this.$message.success(meta.msg)
                // 再次请求动态参数数据
                // this.getManyAttrs()
            })

            objAttr.inputVisible = false;
            objAttr.inputValue = '';
        },
        /*
            添加动态参数:
            id: 分类id
            attr_name：参数名
            attr_sel：many/only
            attr_vals：可选参数

         */
        addManyAttrs() {
            console.log(this.selectedCatObj)
            this.$http.post(`categories/${this.selectedCatObj.goods_cat[this.selectedCatObj.goods_cat.length - 1]}/attributes`, {
                attr_name: this.manyVal,
                attr_sel: 'many',
                attr_vals: 'a,b,c'
            }).then(res => {
                console.log(res)
                let { data, meta } = res.data
                // 失败
                if (meta.status !== 201) return this.$message.error(meta.msg)
                // 成功
                this.$message.success(meta.msg)
                // 再次请求动态参数数据
                this.getManyAttrs()
                // 关闭模态框
                this.manyDialogFormVisible = false

            })
        },
        // 
        /*   
            请求参数公共方法
            sel: 代表请求的是静态参数还是动态参数
            dataAttrs: 代表赋值给data中定义的静态还是动态的变量
         */
        getAttrs(sel, manyOrOnly) {
            /*
               id: 三级分类的分类id -> this.selectedCatArr
               sel: many或only -> 是动态还是静态
            */
            this.$http.get(`categories/${this.selectedCatObj.goods_cat[this.selectedCatObj.goods_cat.length - 1]}/attributes`, {
                params: {
                    sel // 是动态还是静态
                }
            }).then(res => {
                console.log(res)
                let { data, meta } = res.data
                // 给动态参数的每一个对象设置两个属性在渲染tag的时候保证各自能够隔离开来控制各自的编辑及隐藏等状态（避免，比如添加参数值的时候，点击new tag其它行中new tag也是可编辑状态）
                data.map(item => {
                    // 如果为空，则 不进行分割，直接返回一个空数据，表示没有可选项；
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // 控制tag显示还是隐藏的字段
                    item.inputVisible = false
                    // 获取new tag里面的值的字段
                    item.inputValue = ''
                })
                // 如果manyOrOnly为0，那么赋值给动态参数的变量；如果manyOrOnly等于1，那么赋值给静态参数的变量
                if (manyOrOnly === '0') this.manyAttrs = data
                if (manyOrOnly === '1') this.onlyAttrs = data
            })
        },
        // tabs切换
        handleClick(tab) {
            console.log(tab);
            let { index } = tab
            if (index === '0') {
                // 调用动态参数的方法
                this.getAttrs('many', index)
            }
            if (index === '1') {
                // 调用静态参数的方法
                this.getAttrs('only', index)
            }
        },
        /*
            选择分类的时候执行该方法
            value：是当前选中的分类的id，比如像这样[1, 3, 6]
         */
        handleChange(value) {
            // 调用获取参数的公共方法 - 默认调用动态参数，0代表了动态参数，静态参数是1
            this.getAttrs('many', '0')
        }
    }
};
</script>
<style scoped>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.box-card {
    margin-top: 12px;
}

.el-input-group {
    width: 32%;
    margin-right: 12px;
}

.custom-table {
    margin-top: 12px;
    width: 100%;
}

.custom-tag {
    margin: 5px 10px;
}
</style>