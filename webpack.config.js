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
  }
}];