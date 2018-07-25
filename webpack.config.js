var path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/jColor.js',
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    output: {
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