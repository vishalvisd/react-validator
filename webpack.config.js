var webpack = require("webpack");
module.exports = [{
  entry: {
    index: "./src.js"
  },
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    library: "[name]"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel?presets[]=es2015,presets[]=react,presets[]=stage-0,plugins[]=transform-object-rest-spread"
      }
    ]
  },
  externals: {
    lodash: {
      amd: "lodash",
      commonjs: "lodash",
      commonjs2: "lodash",
      root: "_"
    },
    "prop-types": {
      amd: "prop-types",
      commonjs2: "prop-types",
      commonjs: "prop-types",
      root: "PropTypes"
    },
    react: {
      amd: "react",
      commonjs2: "react",
      commonjs: "react",
      root: "React"
    }
  }
}];