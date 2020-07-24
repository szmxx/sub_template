const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const productionGzipExtensions = ["js", "css"];
function resolve(dir) {
  return path.join(__dirname, dir);
}
const dllReference = config => {
  config.plugin("vendorDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/vendor.manifest.json")
    }
  ]);

  config.plugin("utilDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/util.manifest.json")
    }
  ]);
  config.plugin("libDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/lib.manifest.json")
    }
  ]);

  config
    .plugin("addAssetHtml")
    .use(AddAssetHtmlPlugin, [
      [
        {
          filepath: require.resolve(
            path.resolve(__dirname, "dll/vendor.dll.js")
          ),
          outputPath: "dll",
          publicPath: "/dll"
        },
        {
          filepath: require.resolve(path.resolve(__dirname, "dll/util.dll.js")),
          outputPath: "dll",
          publicPath: "/dll"
        },
        {
          filepath: require.resolve(path.resolve(__dirname, "dll/lib.dll.js")),
          outputPath: "dll",
          publicPath: "/dll"
        }
      ]
    ])
    .after("html");
};
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    port: 9527,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  transpileDependencies: ["view-design"],
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/index.scss";`
      }
    }
  },
  chainWebpack: function(config) {
    config.resolve.alias.set("@", resolve("src"));
    // 鼠标指针样式
    config.module
      .rule("mouse")
      .test(/\.(ico|cur)(\?.*)?$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "[path][name].[ext]"
      })
      .end();
    // use svg
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.include
      .add(resolve("src/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    // use images
    const imagesRule = config.module.rule("images");
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/svg"))
      .end();
    if (process.env.NODE_ENV === "production") {
      dllReference(config);
    }
  },
  // eval-nosources-source-map、inline-source-map、cheap-module-eval-source-map、""、
  // 设置eval-nosources-source-map值，TerserPlugin不起作用
  configureWebpack: {
    devtool:
      process.env.NODE_ENV === "production"
        ? "source-map"
        : "inline-source-map",
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
    plugins:
      process.env.NODE_ENV === "production"
        ? [
            new CompressionPlugin({
              filename: "[path].gz[query]",
              algorithm: "gzip",
              test: new RegExp(
                "\\.(" + productionGzipExtensions.join("|") + ")$"
              ),
              threshold: 10240,
              minRatio: 0.8
            }),
            new BundleAnalyzerPlugin()
          ]
        : []
  }
};
