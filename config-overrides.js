const webpack = require("webpack");

module.exports = function override(config) {
	config.resolve.fallback = {
		...config.resolve.fallback,
		assert: require.resolve("assert/"),
		stream: require.resolve("stream-browserify/index.js"),
		crypto: require.resolve("crypto-browserify/index.js"),
		buffer: require.resolve("buffer/index.js"),
	};

	config.plugins = [
		...(config.plugins || []),
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
			process: "process/browser.js",
		}),
	];

	return config;
};
