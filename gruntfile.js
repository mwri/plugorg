module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n\n',
				stripBanners: { line: true },
				banner: '// Package: <%= pkg.name %> v<%= pkg.version %> (built <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n// Copyright: (C) 2017 <%= pkg.author.name %> <<%= pkg.author.email %>>\n// License: <%= pkg.license %>\n\n\n',
			},
			es6: {
				src: ['lib/*.js'],
				dest: 'dist/<%= pkg.name %>.js',
			},
		},

		jshint: {
			files: ['gruntfile.js', 'lib/*.js', 'test/*.js'],
			options: {
				esversion: 6,
				laxbreak: true,
			},
		},

		simplemocha: {
			all: {
				src: ['test/*.js'],
			},
		},

		mocha_istanbul: {
			all: {
				src: ['test/*.js'],
			},
		},

		webpack: {
			bundle: require('./webpack.config'),
		},

		watch: {
			full: {
				options: {
					spawn: true,
				},
				files: [
					'lib/*.js',
					'test/*.js',
					'test/node_modules/*/*.js',
				],
				tasks: ['build'],
			},
			dev: {
				options: {
					spawn: true,
				},
				files: [
					'lib/*.js',
					'test/*.js',
				],
				tasks: ['dev'],
			},
		},

	});

	grunt.registerTask('prepublish', [
		'clean',
		'gitstatus:publish',
	]);

	grunt.registerTask('dev', [
		'jshint',
		'concat:es6',
		'webpack',
		'simplemocha',
	]);

	grunt.registerTask('build', [
		'jshint',
		'concat:es6',
		'webpack',
		'mocha_istanbul',
	]);

	grunt.registerTask('travis_ci_build', [
		'jshint',
		'concat:es5',
		'concat:es6',
		'babel',
		'uglify',
		'mocha_istanbul',
	]);

	grunt.registerTask('default', ['build']);
	grunt.registerTask('test',    ['build']);

	grunt.registerTask('watch_full', ['watch:full']);
	grunt.registerTask('watch_dev',  ['watch:dev']);

};
