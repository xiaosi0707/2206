const fs = require('fs')
const path = require('path')

// 函数封装
function getFileContent(fileName, callback) {
    const fullName = path.resolve(__dirname, '', fileName)
    fs.readFile(fullName, (err, data) => {
        if (err) return
        callback(JSON.parse(data.toString()))
    })
}

// 函数调用
getFileContent('a.json', aData => {
    console.log(aData)
    getFileContent(aData.src, bData => {
        console.log(bData)
        getFileContent(bData.src, cData => {
            console.log(cData)
        })
    })
})
console.log('app')