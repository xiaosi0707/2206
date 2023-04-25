<template>
    <div>
        <h1>我是父组件</h1>
        {{ num }}
        <button @click="num++">改变数据</button>
        <hr>
        <child :count.sync="num"/>
    </div>

</template>
<script>
import Child from './child'
export default {
    components: { Child },
    data() {
        return {
            num: 0
        }
    }
}
</script>