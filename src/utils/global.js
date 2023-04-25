let timer = null
let count = 0
function debounce(fn, delay, immediate = false) {
    // 清除现有的定时器
    clearTimeout(timer)
    // 判断是不是首次点击
    if (immediate && !count) {
        fn()
        count++
    } else { // 非首次点击按照防抖的特点进行执行
        timer = setTimeout(() => {
            fn()
            count++
        }, delay)
    }

}

// function debounce(fn, delay, immediate = false) {
//     let timer = null
//     let count = 0
//     return function() {
//         // 清除现有的定时器
//         clearTimeout(timer)
//         // 判断是不是首次点击
//         if (immediate && !count) {
//             fn()
//             count++
//         } else { // 非首次点击按照防抖的特点进行执行
//             timer = setTimeout(() => {
//                 fn()
//                 count++
//             }, delay)
//         }
//     }

// }
export {
    debounce
}