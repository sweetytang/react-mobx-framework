const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { resolvePath } = require('../util/resolvePath');

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        static: resolvePath('public'),
        port: 9000,
        client: {
            overlay: true,
        },
        hot: false,
        liveload: true,
        open: true
    }
});