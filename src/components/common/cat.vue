<template>
    <div>
        <!-- 商品分类
	        :options -> 遍历的数据源
	        :props -> 配置需要渲染的字段
	        v-model="" -> 把当前选中的分类通过v-model赋值给请求参数addGoodsQuery中的goods_cat字段（goods_cat固定的父组件不能改变）
	     -->
        <el-cascader v-model="catCurrent.goods_cat"  :options="catData" :props="catProps"></el-cascader>
    </div>
</template>
<script>
export default {
	props: {
		// 数据源
		catData: {
			type: Array,
			required: true
		},
		// 字段的配置
		catProps: {
			type: Object,
			required: true
		},
		// 把当前选中的分类通过v-model赋值给请求参数addGoodsQuery中的goods_cat字段
		catCurrent: {
			type: Object // 这里一定是对象，因为只有对象里面的属性才可以响应式（子改变父的时候，才不会报错）
		}
	}
}
</script>