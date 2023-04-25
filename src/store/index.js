import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)
//创建store对象
const store = new Vuex.Store({
    state: {
        list: [], // 定义共享数据list
        inputValue: '',
        nextId: null, //1.定义一个新增时的id
    },
    getters: {
        //统计未完成任务的条数
        undoneLength(state) {
            let newA = state.list.filter(item => item.done === false)
            return newA.length
        },
        //统计已完成任务的条数
        doneLength(state) {
            let newA = state.list.filter(item => item.done === true)
            return newA.length
        }
    },
    mutations: {
        // 要想调用该函数，必须传入一个list,函数中把state中的list赋值为当前传入的这个参数list
        initList(state, list) {
            state.list = list
        },
        setInputValue(state, val) {
            state.inputValue = val
        },
        //3.新增任务
        addItem(state) {
            //如果输入框内容不为空
            if (state.inputValue.trim() !== '') {
                let obj = {
                    "id": state.nextId,
                    "info": state.inputValue.trim(),
                    "done": false
                }
                state.list.push(obj) //新增任务放入共享list
                state.nextId++; //之后把nextId自增，保证下一次新增时id的唯一性
                state.inputValue = '' //然后把输入框内容清空
            }
        },
        deleteItem(state, id) {
            //1 找到要删除的项在list中的索引
            let index = state.list.findIndex(item => item.id === id)
            //2 根据索引删除list
            state.list.splice(index, 1)
        },
        changeStatus(state, param) {
            //1也是先通过任务id 获取到改变状态的这个任务的索引
            let index = state.list.findIndex(item => item.id === param.id)
            //2然后通过索引改变数组list中的done属性
            state.list[index].done = param.done;
        }
    },
    actions: {
        getList(context) {
            console.log(this)
            //异步请求
            Axios.get('/list.json').then(res => {
                //通过commit触发mutations中函数initList，并传入参数res
                console.log(res)
                context.commit('initList', res.data)
            })
        }
    }
})
export default store