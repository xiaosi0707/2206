<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-steps :active="active" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-tabs tab-position="left" @tab-click="tabTrigger" :before-leave="beforeLeaveTab">
                <el-tab-pane label="基本信息" name="0">
                    <el-form :model="addGoodsQuery" :rules="addGoodsRules" ref="addGoodsRef" label-width="80px" label-position="top">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsQuery.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsQuery.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsQuery.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsQuery.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 商品分类 
                                :cat-data 数据源
                                :cat-props 显示字段的配置
                                :cat-current 把当前选中的分类对象传递给子组件通过子组件中的v-model取到当前选中的分类id
                            -->
                            {{ addGoodsQuery }}
                            <cat :cat-current="addGoodsQuery" :cat-data="classifyList" :cat-props="props"/>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- 商品参数 step - 2 -->
                <el-tab-pane label="商品参数" name="1">
                    <el-form label-position="top" label-width="80px">
                        {{ manyAttrs }} - {{checkedList}}
                        <!-- item.attr_name是显示在页面上的名字 -->
                        <el-form-item v-for="item in manyAttrs" :label="item.attr_name" :key="item.attr_id">
                            <!-- 复选框组 
                                checkedList是个数组，放的是item.attr_vals的值
                                border：给checkbox添加边框
                            -->
                            <el-checkbox-group v-model="checkedList">
                                <!-- 如果没有span里面的那么就会把label内容显示在页面上，有了span里面的label的就不显示了 -->
                                <el-checkbox v-for="attr in item.attr_vals.split(' ')" :label="attr" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form label-position="top" label-width="80px">
                        <!-- 静态参数渲染 -->
                        <el-form-item :label="item.attr_name" v-for="item in onlyAttrs">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload class="upload-demo" action="http://114.115.206.38:8888/api/private/v1/upload" :headers="headerObj" :file-list="fileList" :on-success="handleSuccess" list-type="picture" show-file-list>
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器 -->
                    <quill-editor ref="myQuillEditor" v-model="addGoodsQuery.goods_introduce" />
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Cat from './common/cat.vue'


export default {
    components: { //界面组件引用
        quillEditor,
        Cat
    },
    data() {
        return {
            // el-steps的默认值
            active: 1,
            // 获取到的动态属性
            checkedList: [],
            // 富文本编辑器的变量
            content: '<h1>hello</h1>',
            // 图片临时存储的数组
            fileList: [],
            // 上传图片请求头
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            value: '',
            // 分类数据数据源
            classifyList: [],
            // 获取当前选中的分类id
            currentClassifyList: [],
            // 分类配置
            props: {
                expandTrigger: 'hover', // 触发方式
                label: 'cat_name', // 显示的名字
                value: 'cat_id' // 分类id
            },
            // 动态参数
            manyAttrs: [],
            // 静态参数
            onlyAttrs: [],
            // 添加商品的请求参数
            addGoodsQuery: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: [],
                attrs: []
            },
            // 校验
            addGoodsRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择分类', trigger: 'change' }
                ]
            }
        }
    },
    created() {
        // 请求分类接口
        this.$http.get(`categories`).then(res => {
            console.log((res))
            let { data, meta } = res.data
            this.classifyList = data
        })
    },
    methods: {
        // 获取到子组件传递过来的分类id
        receiveSelected(selectedArr) {
            // 把选中分类后的id放在currentClassifyList中，供请求参数接口的时候使用，value是个数组
            this.currentClassifyList = selectedArr
        },
        // 切换tab之前
        // activeName：当前的index
        // oldActiveName：之前的index
        beforeLeaveTab(activeName, oldActiveName) {
            // flag控制是否能切换是个boolean值
            let flag = true
            // 在第一个tab
            if (oldActiveName === '0') {
                console.log(this)
                // 如果为false校验未通过flag赋值为false，不能切换tab
                this.$refs.addGoodsRef.validate(valid => {
                    if (!valid) {
                        flag = false
                    }
                })
                // 返回值
                return flag
            }
            // if (oldActiveName === '0' && this.addGoodsQuery.goods_cat.length !== 3) {
            //     this.$message.error('请先选择商品分类！')
            //     return false
            // }
        },
        // 文件上传成功
        handleSuccess(response, file, fileList) {
            // console.log(response, file, fileList);

            // 把上传成功的照片路径解构出来
            let { tmp_path } = response.data
            // 按照请求参数的要求做数据格式的处理
            let arrPic = { pic: tmp_path }
            // 赋值给添加商品的请求参数
            this.addGoodsQuery.pics.push(arrPic)
        },

        addGoods() {
            // 处理动态属性：
            // 遍历从接口取到的动态参数数据[{ attr_id: 3803,attr_name: "内存", attr_sel: "many", attr_vals: "4G,8G", attr_write: "list", cat_id: 6 }, {attr_id: 3077, attr_name: "版式", attr_sel: "many", attr_vals: "aa,bb,cc,ee 立体 平面 曲面", attr_write: "list", cat_id: 6, delete_time: null}]
            this.addGoodsQuery.attrs = []
            this.manyAttrs.map((item, index) => {
                // console.log(item)
                // 遍历选中的动态参数['曲面', '立体']
                this.checkedList.map(item1 => {
                    // console.log(item1)
                    // 如果在动态参数数据中的attr_vals字段中，有我们选中的参数值
                    if (item.attr_vals.indexOf(item1) !== -1) {
                        // 在新定义的数组中有没有已经存在对象，如果没有
                        if (this.addGoodsQuery.attrs.indexOf(item) === -1) {
                            // 那么才能push到this.addGoodsQuery.attrs数组中（避免重复的对象）
                            this.addGoodsQuery.attrs.push(item)
                        }
                    }
                })
            })

            // 去掉动态参数的多余字段
            this.addGoodsQuery.attrs.map((item, i) => {
                let newObj = { 'attr_id': item.attr_id, 'attr_value': item.attr_vals }
                this.addGoodsQuery.attrs[i] = newObj
            })
            console.log(this.addGoodsQuery.attrs)


            // 处理静态属性
            this.onlyAttrs.map(item => {
                let onlyObj = { attr_id: item.attr_id, attr_value: item.attr_vals }
                this.addGoodsQuery.attrs.push(onlyObj)
            })

            // 处理分类id：
            // 把获取到的分类数组数据格式按照接口文档的要求该字段为字符串所以需要数组转字符串
            this.addGoodsQuery.goods_cat = this.addGoodsQuery.goods_cat.toString()

            // console.log(this.addGoodsQuery)
            // 请求添加商品的接口
            this.$http.post('goods', this.addGoodsQuery).then(res => {
                console.log(res)
                let { data, meta } = res.data
                // 失败
                if (meta.status !== 201) return this.$message.error(meta.msg)
                // 成功
                this.$message.success(meta.msg)
                // 回到商品
                this.$router.push('/goods')
                // 调用接口商品内容完成
                this.active = 6
            })
        },
       
        // tab切换时候触发的方法
        tabTrigger(tab, ev) {
            // 步骤跟随左侧tab联动
            this.active = Number(tab.name)
            let { index } = tab
            // 请求动态参数
            if (index === '1') {
                this.getAttrs('many', index)
            }

            // 请求静态参数
            if (index === '2') {
                this.getAttrs('only', index)
            }
        },
        // 请求参数方法封装
        getAttrs(sel, active) {
            // ${this.currentClassifyList[this.currentClassifyList.length - 1]}
            // 请求参数接口
            this.$http.get(`categories/6/attributes`, {
                params: {
                    sel: sel // 是动态还是静态
                }
            }).then(res => {
                let { data, meta } = res.data

                // 在data中用哪个变量接收
                if (active === '1') {
                    this.manyAttrs = data
                } else {
                    this.onlyAttrs = data
                }

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