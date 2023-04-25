<template>
    <div>
        <!-- 面包屑 -->
        <wyf-bread parentName="数据统计" currentName="数据报表" currentPath="/reports" />
        <div id="main" style="width: 100%; height: 620px">
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
    mounted() {
        this.$http.get('reports/type/1').then(res => {
            console.log(res)
            let { data } = res.data
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 绘制图表
            myChart.setOption(data);
        })

    }
}
</script>