<template>
    <el-input placeholder="请输入内容" v-model="searchVal" v-focus>
        <template slot="append">
            <i class="el-icon-search" @click="search"></i>
        </template>
    </el-input>
</template>
<script>
export default {
	data() {
		return {
			searchVal: ''
		}
	},
	methods: {
		search() {
			this.$emit('sendSearch', this.searchVal)
		}
	}
}
</script>