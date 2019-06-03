(function () {


"use strict";


let plugorg      = require('./../lib/plugorg.js');
let chai_jasmine = require('chai-jasmine');
let mimock       = require('mimock');
let mockset      = mimock.mockset;

let mi_pt1_con  = require('./node_modules/pt1/index.js');
let mi_pl1_con  = require('./node_modules/pl1/index.js');


describe('add_type', function () {

	describe('by import', function () {

		let po;
		before(function () {
			po = new plugorg();
		});

		it('succeeds', function () {
			po.add_type('./../test/node_modules/pt1/index.js');
		});

		it('plugin type indexed by name', function () {
			expect(po.get_type({name:'pt1'}).constructor).toBe(mi_pt1_con);
		});

		it('fails when already added', function () {
			try {
				po.add_type('./../test/node_modules/pt1/index.js');
				throw new Error('error should have been thrown due to plugin type already added');
			} catch (err) {
				if (!/name clash, or already added/.exec(err))
					throw err;
			}
		});

		it('fails when illegal name attribute declared', function () {
			try {
				po.add_type('./../test/node_modules/pt5/index.js');
				throw new Error('error should have been thrown due to illegal name attribute');
			} catch (err) {
				if (!/illegal attribute "name"/.exec(err))
					throw err;
			}
		});

		it('fails when illegal type attribute declared', function () {
			try {
				po.add_type('./../test/node_modules/pt6/index.js');
				throw new Error('error should have been thrown due to illegal type attribute');
			} catch (err) {
				if (!/illegal attribute "type"/.exec(err))
					throw err;
			}
		});

	});

	describe('by fun', function () {

		let po;
		before(function () {
			po = new plugorg();
		});

		it('succeeds', function () {
			let pt_con = require('./node_modules/pt1/index.js');
			po.add_type(pt_con);
		});

		it('plugin type indexed by name', function () {
			expect(po.get_type({name:'pt1'}).constructor).toBe(mi_pt1_con);
		});

		it('fails when already added', function () {
			try {
				let pt_con = require('./node_modules/pt1/index.js');
				po.add_type(pt_con);
				throw new Error('error should have been thrown due to plugin type already added');
			} catch (err) {
				if (!/name clash, or already added/.exec(err))
					throw err;
			}
		});

	});

});


describe('add_plugin (minimal)', function () {

	describe('by import', function () {

		let po;
		before(function () {
			po = new plugorg();
		});

		it('succeeds', function () {
			po.add_plugin('./../test/node_modules/pl1/index.js');
		});

		it('plugin indexed by name', function () {
			expect(po.get_plugin({name:'pl1'}).constructor).toBe(mi_pl1_con);
		});

		it('fails when already added', function () {
			try {
				po.add_plugin('./../test/node_modules/pl1/index.js');
				throw new Error('error should have been thrown due to plugin already added');
			} catch (err) {
				if (!/name clash, or already added/.exec(err))
					throw err;
			}
		});

		it('fails when illegal name attribute declared', function () {
			try {
				po.add_plugin('./../test/node_modules/pl5/index.js');
				throw new Error('error should have been thrown due to illegal name attribute');
			} catch (err) {
				if (!/illegal attribute "name"/.exec(err))
					throw err;
			}
		});

		it('fails when illegal type attribute declared', function () {
			try {
				po.add_plugin('./../test/node_modules/pl6/index.js');
				throw new Error('error should have been thrown due to illegal type attribute');
			} catch (err) {
				if (!/illegal attribute "type"/.exec(err))
					throw err;
			}
		});

	});

	describe('by fun', function () {

		let po;
		before(function () {
			po = new plugorg();
		});

		it('succeeds', function () {
			let pl_con = require('./node_modules/pl1/index.js');
			po.add_plugin(pl_con);
		});

		it('plugin indexed by name', function () {
			expect(po.get_plugin({name:'pl1'}).constructor).toBe(mi_pl1_con);
		});

		it('fails when already added', function () {
			try {
				let pl_con = require('./node_modules/pl1/index.js');
				po.add_plugin(pl_con);
				throw new Error('error should have been thrown due to plugin already added');
			} catch (err) {
				if (!/name clash, or already added/.exec(err))
					throw err;
			}
		});

	});

});


describe('add_plugin (useful)', function () {

	let mocks = new mockset();

	let po;
	before(function () {
		po = new plugorg();
	});

	let pt2;
	let pt4;

	it('fails before plugin type added', function () {
		try {
			po.add_plugin('./../test/node_modules/pl2/index.js');
			throw new Error('error should have been thrown due to plugin type not added');
		} catch (err) {
			if (!/plugin type "pt2" not known/.exec(err))
				throw err;
		}
	});

	it('fails when plugin type verification fails', function () {
		let mocks = new mockset();
		try {
			pt2 = po.add_type('./../test/node_modules/pt2/index.js');
			let pl_con = require('./node_modules/pl2/index.js');
			mocks.object(pt2).method('po_validplugin').wrap(function () {
				return false;
			});
			po.add_plugin(pl_con);
			mocks.restore();
			throw new Error('error should have been thrown due to plugin validation failure');
		} catch (err) {
			mocks.restore();
			if (!/validation failed/.exec(err))
				throw err;
		}
	});

	it('plugin type verification exceptions propogated', function () {
		let mocks = new mockset();
		try {
			pt4 = po.add_type('./../test/node_modules/pt4/index.js');
			let pl_con = require('./node_modules/pl4/index.js');
			mocks.object(pt4).method('po_validplugin').wrap(function () {
				throw new Error('spanner');
			});
			po.add_plugin(pl_con);
			mocks.restore();
			throw new Error('error should have been thrown due to plugin validation failure');
		} catch (err) {
			mocks.restore();
			if (!/spanner/.exec(err))
				throw err;
		}
	});

	it('succeeds (validated)', function () {
		let mocks = new mockset();
		let pl_con = require('./node_modules/pl2/index.js');
		mocks.object(pt2).method('po_validplugin').wrap(function () {
			return true;
		});
		po.add_plugin(pl_con);
		mocks.restore();
	});

	it('add second plugin 3', function () {
		let mocks = new mockset();
		mocks.object(pt2).method('po_validplugin').wrap(function () {
			return true;
		});
		po.add_type('./../test/node_modules/pt1/index.js');
		po.add_plugin('./../test/node_modules/pl3/index.js');
		mocks.restore();
	});

	it('add plugin 4 (attribs)', function () {
		let mocks = new mockset();
		mocks.object(pt4).method('po_validplugin').wrap(function () {
			return true;
		});
		po.add_plugin('./../test/node_modules/pl4/index.js');
		mocks.restore();
	});

	describe('get_type', function () {

		it('gets plugin type by name', function () {
			let pt1 = po.get_type({name:'pt1'});
			expect(pt1.po_name()).toBe('pt1');
			let pt2 = po.get_type({name:'pt2'});
			expect(pt2.po_name()).toBe('pt2');
		});

		it('returns undefined when not found', function () {
			expect(po.get_type({name:'404'})).toBe(undefined);
		});

		it('returns undefined when index does not exist', function () {
			expect(po.get_type({404:'500'})).toBe(undefined);
		});

		it('throws and error when multiple plugin types are matched', function () {
			try {
				po.get_type();
				throw new Error('error should have been thrown due to get_plugin() matching multiple plugin types');
			} catch (err) {
				if (!/multiple results/.exec(err))
					throw err;
			}
		});

	});

	describe('get_types', function () {

		it('gets a plugin type by name', function () {
			let pt_list = po.get_types({name:'pt1'});
			expect(pt_list.length).toBe(1);
			expect(pt_list[0].po_name()).toBe('pt1');
			pt_list = po.get_types({name:'pt2'});
			expect(pt_list.length).toBe(1);
			expect(pt_list[0].po_name()).toBe('pt2');
		});

		it('gets all plugin types', function () {
			let pt_list = po.get_types();
			expect(pt_list.length).toBe(4);
			expect(pt_list.map((pt) => { return pt.po_name(); }).sort()).toEqual([
				'default',
				'pt1',
				'pt2',
				'pt4',
			]);
		});

		it('gets types by attrib', function () {
			let pt_list = po.get_types({baz:2});
			expect(pt_list.length).toBe(1);
			expect(pt_list[0].po_name()).toBe('pt4');
		});

		it('returns empty list when not found', function () {
			expect(po.get_types({name:'404'})).toEqual([]);
		});

		it('returns empty list when index does not exist', function () {
			expect(po.get_types({404:'500'})).toEqual([]);
		});

	});

	describe('get_plugin', function () {

		it('gets plugin by name', function () {
			let pl2 = po.get_plugin({name:'pl2'});
			expect(pl2.po_name()).toBe('pl2');
			let pl3 = po.get_plugin({name:'pl3'});
			expect(pl3.po_name()).toBe('pl3');
		});

		it('returns undefined when not found', function () {
			expect(po.get_plugin({name:'404'})).toBe(undefined);
		});

		it('returns undefined when index does not exist', function () {
			expect(po.get_plugin({404:'500'})).toBe(undefined);
		});

		it('throws and error when multiple plugins are matched', function () {
			try {
				po.get_plugin();
				throw new Error('error should have been thrown due to get_plugin() matching multiple plugin');
			} catch (err) {
				if (!/multiple results/.exec(err))
					throw err;
			}
		});

	});

	describe('get_plugins', function () {

		it('gets a plugin by name', function () {
			let pl_list = po.get_plugins({name:'pl2'});
			expect(pl_list.length).toBe(1);
			expect(pl_list[0].po_name()).toBe('pl2');
			pl_list = po.get_plugins({name:'pl3'});
			expect(pl_list.length).toBe(1);
			expect(pl_list[0].po_name()).toBe('pl3');
		});

		it('gets all plugins', function () {
			let pl_list = po.get_plugins();
			expect(pl_list.length).toBe(3);
			expect(pl_list.map((pt) => { return pt.po_name(); }).sort()).toEqual([
				'pl2',
				'pl3',
				'pl4',
			]);
		});

		it('gets plugins by type', function () {
			let pl_list = po.get_plugins({type:'pt2'});
			expect(pl_list.length).toBe(2);
			expect(pl_list[0].po_name()).toBe('pl2');
			expect(pl_list[1].po_name()).toBe('pl3');
		});

		it('gets plugins by attrib', function () {
			let pl_list = po.get_plugins({yah:'hoo'});
			expect(pl_list.length).toBe(1);
			expect(pl_list[0].po_name()).toBe('pl4');
		});

		it('returns empty list when not found', function () {
			expect(po.get_plugins({name:'404'})).toEqual([]);
		});

		it('returns empty list when index does not exist', function () {
			expect(po.get_plugins({404:'500'})).toEqual([]);
		});

	});

});


})();
