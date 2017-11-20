const path = require('path');

const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
// var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css 合并\
function resolve(dir){//因为自己改变了文件的路径，这里需要重新处理一下

    return path.join(__dirname,'..',dir);

}
console.log(__dirname)
var mould = {
	entry : "./src/ReactFabricEditor.js",
	output: {  
	    path:__dirname+"/lib/",  
	    filename:"ReactFabricEditor.js"
    },
	devtool: 'eval-source-map',
	module: {         //加载器配置       
        rules: [
            {// 处理js-es6的规则
                test:/\.(js|jsx|es6)$/,//匹配资源，处理的文件的后缀名
                exclude:path.join(__dirname,'node_modules'),//排除匹配的文件夹
                use:{
                	loader:'babel-loader'
                },//每个入口（entry）指定使用一个loader，处理的加载器是loader
                include:path.join(__dirname,'src'),//包含的路径（匹配特定条件）
            }, {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:{
                        loader:'css-loader'
                    },
                    publicPath: "./lib"//生产环境下（也就是npm run lib之后）重写资源的引入的路径,参考链接https://webpack.js.org/plugins/extract-text-webpack-plugin/#-extract

                })
            }]    
    },
    plugins:[
    	new ExtractTextPlugin('[name].css'),
  ],
}

module.exports = mould;