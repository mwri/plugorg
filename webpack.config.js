const path = require('path');

module.exports = {

	entry: './webpack_entry.js',

	output: {
		filename: './dist/plugorg_bundle.min.js',
	},

	module: {
		rules: [{
			test: require.resolve('./dist/plugorg.js'),
			use: [{
				loader: 'expose-loader',
				options: 'plugorg'
			}],
		}],
	},

	resolve: {
		modules: [
			path.resolve(__dirname, './node_modules'),
		],
	},

};
