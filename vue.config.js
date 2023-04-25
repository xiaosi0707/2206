const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
    transpileDependencies: true,
    // publicPath: process.env.NODE_ENV === 'production' ? './production-dist/' : './',
    publicPath: "./", // 部署应⽤包时的基本 URL
    devServer: {
        historyApiFallback: true
    },

})