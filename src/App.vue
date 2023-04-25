<template>
    <div id="app">
        <div class="todoForm">
            <p>
                <input type="text" placeholder="请输入任务" class="addInput" :value="inputValue" @keyup="inputChangeFn">
                <button class="addBtn" @click="addToList">添加事项</button>
            </p>
            <ul class="dataList">
                <li v-for="item in list" :key="item.id">
                    <input type="checkbox" :checked="item.done" @change="statusChangeFn($event,item.id)">
                    <span>{{item.info}}{{ item.done }}</span>
                    <a href="javascript:;" @click="deleteIt(item.id)">删除</a>
                </li>
            </ul>
            <div class="txt">已完成（{{doneLength}}）未完成（{{undoneLength}}）</div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'App',
    created() {
        this.getList()
    },
    computed: {
        ...mapState(['list', 'inputValue']),
        ...mapGetters(['undoneLength', 'doneLength'])
    },
    methods: {
        ...mapMutations(['initList', 'setInputValue', 'addItem', 'deleteItem', 'changeStatus']),
        ...mapActions(['getList']),
        //输入框内容改变事件
        inputChangeFn(e) {
            //输入框内容
            this.setInputValue(e.target.value)
        },
        //向列表中新增项
        addToList() {
            //commit触发mutations中的addItem方法，我们下一步编写这个方法
            this.addItem()
        },
        //根据id删除对应项
        deleteIt(id) {
            //commit触发mutations中的deleteItem方法
            this.deleteItem(id)
        },
        //选中状态改变事件
        statusChangeFn(e, id) {
            console.log(e)
            const param = {
                "id": id,
                "done": e.target.checked
            } //因为commit只能传入除mutation事件名之外的一个参数，我们用对象形式来传递id和done
            this.changeStatus(param)
        },
    }
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
}

html,
body {
    width: 100%;
    height: 100%;
}

.todoForm {
    width: 460px;
    margin: 20px auto;
}

.addInput {
    width: 370px;
    line-height: 32px;
    border: 1px solid #bbb;
    border-radius: 4px;
    padding: 0 4px;
}

.addBtn {
    width: 80px;
    border: none;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    background-color: #22bbf6;
    font-size: 14px;
    color: white;
    cursor: pointer;
}

.addBtn:hover {
    background-color: #0799d2;
}

.dataList {
    margin-top: 5px;
    border: 1px solid #bbb
}

.dataList li {
    list-style: none;
    padding: 0 5px;
    line-height: 35px;
    margin: 3px 0;
    background-color: #f4f4f4;
}

.dataList li>input[type=checkbox] {
    margin-right: 5px;
}

.dataList li>a {
    float: right;
    text-decoration: none;
    color: #22bbf6;
    font-size: 14px;
}

.txt {
    text-align: right;
    font-size: 14px;
}
</style>