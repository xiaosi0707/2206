<template>
    <div class="login">
        <el-row justify="center" type="flex">
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form :model="loginForm" ref="loginFormRef" label-width="80px" :rules="rules">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="loginForm.username" autocomplete="off" v-focus></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="loginForm.password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loginDebounce">登录</el-button>
                            <el-button>重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ]
            }
        }

    },
    methods: {
        // 登陆
        loginDebounce() {
          
            this.debounce(this.login, 1000, true)
        },
        login() {
            this.$refs.loginFormRef.validate(valid => {
                if (!valid) return
                this.$http.post('login', this.loginForm).then(res => {
                    console.log(res)
                    let { data, meta } = res.data
                    // 存储到本地
                    sessionStorage.setItem('token', data.token)
                    // 跳转到主页
                    this.$router.push('/home')
                })
            })
        }

    }
}
</script>
<style>
.login {
    margin-top: 150px;
}
</style>