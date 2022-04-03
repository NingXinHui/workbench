"use strict";
const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
function resolve (dir) {
  return path.join(__dirname, dir);
}

const name = "中恒大耀工业互联网平台"; // 网页标题

const port = process.env.port || process.env.npm_config_port || 80; // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === "development",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: "0.0.0.0",
    port: port,
    // hot: true,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: "http://47.97.255.76:800",
        target: 'http://47.97.255.76:800',
        // target:'http://10.10.11.82:8000/', //郭礼听
        //target: 'http://10.10.11.110:8000', //陈双双
        // target:'http://10.10.11.199:8000', //刘满春
        // target:"http://10.10.11.168:8000", //付宗杰·
        // target:"http://10.10.10.99:8000",//钟涛
        // target:'http://10.10.10.113:8000',//谢恒
        //target: 'http://10.10.11.127:8000',//陈德炎
        // target: 'http://10.10.11.168:8000', // 付宗杰
        // target: 'http://10.10.11.82:8000', //郭礼听
        // target: 'http://10.10.10.129:8000', //何淼军
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },
      "/getml": {
        target: "http://flowable-engine-service.test.jianan.hscloud.top",
        changeOrigin: true,
        pathRewrite: {
          ["^" + "/getml"]: ""
        }
      }
      // :http://flowable-engine-service.test.jianan.hscloud.top
    },
    disableHostCheck: true
  },
  // configureWebpack: {
  //   name: name,
  //   resolve: {
  //     alias: {
  //       "@": resolve("src")
  //     }
  //   },
  //   plugins: [
  //     new MomentLocalesPlugin(),
  //     new MomentLocalesPlugin({
  //       localesToKeep: ["es-us", "ru"]
  //     })
  //   ]
  // },
  configureWebpack: config => {
    const sassLoader = require.resolve("sass-loader");
    config.module.rules
      .filter(rule => {
        return rule.test.toString().indexOf("scss") !== -1;
      })
      .forEach(rule => {
        rule.oneOf.forEach(oneOfRule => {
          const sassLoaderIndex = oneOfRule.use.findIndex(
            item => item.loader === sassLoader
          );
          oneOfRule.use.splice(sassLoaderIndex, 0, {
            loader: require.resolve("css-unicode-loader")
          });
        });
      });
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader

    // const svgRule = config.module.rule('svg');
    // // 清除已有的所有 loader。
    // // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    // svgRule.uses.clear();
    // svgRule
    //   .test(/\.svg$/)
    //   .include.add(path.resolve(__dirname, 'src/assets/icons'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]'
    //   });
    // const fileRule = config.module.rule('file');
    // fileRule.uses.clear();
    // fileRule
    //   .test(/\.svg$/)
    //   .exclude.add(path.resolve(__dirname, 'src/assets/icons'))
    //   .end()
    //   .use('file-loader')
    //   .loader('file-loader');

    // 先试用下面的这种
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single"),
        {
          from: path.resolve(__dirname, "./public/robots.txt"), //防爬虫文件
          to: "./" //到根目录下
        };
    });
  }
};
