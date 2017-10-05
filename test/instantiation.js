(function () {


"use strict";


let plugorg;
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	plugorg = require('./../dist/plugorg.js');
	require('chai-jasmine');
} else {
	plugorg = window.plugorg;
}


let mi_pt1_con  = require('./node_modules/pt1/index.js');
let mi_pt2_con  = require('./node_modules/pt2/index.js');
let mi_pl1_con  = require('./node_modules/pl1/index.js');
let mi_pl2_con  = require('./node_modules/pl2/index.js');


describe('instantiates', function() {

	it('initialises without types or plugins', function() {
		let po = new plugorg();
	});

	describe('with types', function() {

		let po;

		it('initialises', function () {
			let pt2_con = require('./node_modules/pt2/index.js');
			po = new plugorg({
				types: [
					'./../test/node_modules/pt1/index.js',
					pt2_con,
				],
			});
		});

		it('added types', function () {
			expect(po.get_type({name:'pt1'}).constructor).toBe(mi_pt1_con);
			expect(po.get_type({name:'pt2'}).constructor).toBe(mi_pt2_con);
		});

	});

	describe('with plugins', function () {

		let po;

		it('initialises', function () {
			let pt2_con = require('./node_modules/pt2/index.js');
			let pl2_con = require('./node_modules/pl2/index.js');
			po = new plugorg({
				types: [
					'./../test/node_modules/pt1/index.js',
					pt2_con,
				],
				plugins: [
					'./../test/node_modules/pl1/index.js',
					pl2_con,
				],
			});
		});

		it('added plugins', function () {
			expect(po.get_plugin({name:'pl1'}).constructor).toBe(mi_pl1_con);
			expect(po.get_plugin({name:'pl2'}).constructor).toBe(mi_pl2_con);
		});

	});

});





})();
