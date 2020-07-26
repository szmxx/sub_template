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
const dllReference = (config) => {
  config.plugin("vendorDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/vendor.manifest.json"),
    },
  ]);

  config.plugin("utilDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/util.manifest.json"),
    },
  ]);
  config.plugin("libDll").use(webpack.DllReferencePlugin, [
    {
      context: __dirname,
      manifest: require("./dll/lib.manifest.json"),
    },
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
          publicPath: "/dll",
        },
        {
          filepath: require.resolve(path.resolve(__dirname, "dll/util.dll.js")),
          outputPath: "dll",
          publicPath: "/dll",
        },
        {
          filepath: require.resolve(path.resolve(__dirname, "dll/lib.dll.js")),
          outputPath: "dll",
          publicPath: "/dll",
        },
      ],
    ])
    .after("html");
};
let port = 9527;
const { name } = require("./package");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" + name : ".",
  outputDir: name,
  assetsDir: "static",
  filenameHashing: true,
  devServer: {
    port: port,
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  transpileDependencies: ["view-design"],
  parallel: false,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 19.2, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            unitPrecision: 5, //允许REM单位增长到的十进制数字。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ],
      },
      sass: {
        prependData: `@import "@/styles/index.scss";`,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
    // 鼠标指针样式
    config.module
      .rule("mouse")
      .test(/\.(ico|cur)(\?.*)?$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "[path][name].[ext]",
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
        symbolId: "icon-[name]",
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
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest",
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            extractComments: false,
            output: {
              comments: false,
            },
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log"],
            },
          },
        }),
      ],
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
              minRatio: 0.8,
            }),
            new BundleAnalyzerPlugin(),
          ]
        : [],
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
