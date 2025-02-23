module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                modules: process.env.BABEL_ENV === 'esm' ? false : 'cjs',
            }
        ],
        ['@babel/preset-react'],
        ['@babel/preset-typescript']
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-nullish-coalescing-operator',
        '@babel/plugin-transform-optional-chaining',
        '@babel/plugin-transform-runtime'
    ],
  }