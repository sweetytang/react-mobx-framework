const { resolvePath } = require('../util/resolvePath');

module.exports = {
    entry: {
        appDecorator: resolvePath('./src/component/appDecorator.tsx'),
        BaseStore: resolvePath('./src/store/BaseStore.ts'),
        RootStore: resolvePath('./src/store/RootStore.ts'),
    },
    output: {
      filename: "[name].js",
      path: resolvePath('dist'),
      clean: true,
      library: "react-mobx-framework",
      libraryTarget: "umd",
    },
    // devtool: "source-map",
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@client": ["src/client"],
        "@server":["src/server"],
        "@store": ["src/store"],
        "@component": ["src/component"],
        "@type": ["src/type"]
      }
    },
    module: {
      rules: [
        {
            test: /\.(?:js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader",
                options: {
                    cacheDirectory: true
                }
            }]
            
        }
      ],
    },
  };