<template>
    <div>
        <h2>我是子组件</h2>
        {{ count }}
        <button @click="changeData">改变数据</button>
    </div>
</template>
<script>
export default {
    props: ['count'],
    data() {
        return {
            newNum: 5
        }
    },
    methods: {
        changeData() {
            this.$emit('update:count', this.newNum++)
        }
    }
}
</script>