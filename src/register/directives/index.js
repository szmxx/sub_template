import Vue from "vue";
const files = require.context(".", false, /\.js$/);
files.keys().forEach(key => {
  if (key !== "./index.js") {
    let name = key.replace(/^\.\/(.*\/)?/, "").replace(/\.js$/, "");
    let config = files(key);
    Vue.directive(name, config.default || config);
  }
});
