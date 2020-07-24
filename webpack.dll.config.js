const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    vendor: ["vue/dist/vue.runtime.esm.js", "vuex", "vue-router"],
    util: ["lodash"],
    lib: ["axios"]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "dll"),
    library: "dll_[name]"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          extractComments: false,
          output: {
            comments: false
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log"]
          }
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: "dll_[name]",
      path: path.join(__dirname, "dll", "[name].manifest.json"),
      context: __dirname
    })
  ]
};
