import Vue from "vue";
const files = require.context(".", false, /\.vue$/);
files.keys().forEach(key => {
  if (key !== "./index.js") {
    let name = key.replace(/^\.\/(.*\/)?/, "").replace(/\.js$/);
    let config = files(key);
    Vue.filter(name, config.default || config);
  }
});
