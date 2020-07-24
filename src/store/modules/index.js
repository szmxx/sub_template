const files = require.context(".", false, /\.js$/);
const modules = {};
files.keys().forEach(key => {
  if (key !== "./index.js") {
    let moduleName = key.replace(/^\.\/(.*\/)?/, "").replace(/\.js$/, "");
    let moduleConfig = files(key);
    modules[moduleName] = moduleConfig.default || moduleConfig;
  }
});
export default modules;
