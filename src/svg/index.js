const requireAll = requireContext => requireContext.keys().map(requireContext);

let files = require.context("./files", false, /\.svg$/);
requireAll(files);
