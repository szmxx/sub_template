import Vue from "vue";
let files = require.context(".", true, /\.vue$/);
files.keys().forEach(key => {
  if (/[d|D]emo/.test(key)) {
    return;
  }
  let filename = key.replace(/^\.\/(.*\/)?/, "").replace(/\.vue$/, "");
  if (filename.startsWith("CZ")) {
    let componentConfig = files(key);
    Vue.component(filename, () => {
      return new Promise(resolve => {
        resolve(componentConfig.default || componentConfig);
      });
    });
  }
});
