module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: "defaults",
                useBuiltIns: 'usage',
                corejs: 3
            }
        ],
        ['@babel/preset-react'],
        ['@babel/preset-typescript']
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime'
    ],
  }