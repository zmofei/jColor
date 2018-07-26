var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/jColor.js',
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            }
        ]
    },
    output: { 
        library: 'jColor',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'jColor.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true
    },
    watch: true
};