<template>
    <el-dialog :title="title" :visible.sync="modalVisible">
        <el-form :model="modalData">
            <el-form-item label="用户名" :label-width="modalWidth">
                <el-input v-model="modalData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="modalWidth">
                <el-input v-model="modalData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="modalWidth">
                <el-input v-model="modalData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" :label-width="modalWidth">
                <el-input v-model="modalData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="modalVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
	props: [ 'title', 'modalVisible', 'modalData', 'modal-width'],
	methods: {
		addUser() {
			this.$emit('sendAddUser', this.modalData)
		}
	}
}
</script>
<style>

</style>
