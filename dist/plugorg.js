// Package: plugorg v1.0.0 (built 2017-10-05 17:06:52)
// Copyright: (C) 2017 Michael Wright <mjw@methodanalysis.com>
// License: MIT


(function () {


'use strict';


let taffy;
/* istanbul ignore else */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	let taffydb = require('taffydb');
	taffy = taffydb.taffy;
} else {
	taffy = window.TAFFY;
}


let plugorg = (function() {


	let plugorg = function plugorg (params) {

		if (params === undefined)
			params = {};

		this.pltypes = taffy();
		this.plugins = taffy();

		this.add_type(plugorg_pt_default);

		if (params.types)
			for (let i = 0; i < params.types.length; i++)
				this.add_type(params.types[i]);

		if (params.plugins)
			for (let i = 0; i < params.plugins.length; i++)
				this.add_plugin(params.plugins[i]);

	};


	plugorg.prototype.add_type = function (ref, pt_params) {

		let pt_con = typeof ref === 'string'
			? require(ref)
			: ref;

		let pt_name = pt_con.prototype.po_name();

		if (this.pltypes({name:pt_name}).get().length > 0)
			throw new Error('name clash, or already added');

		let attribs = typeof pt_con.prototype.po_attribs === 'function'
			? pt_con.prototype.po_attribs()
			: {};

		let pt_inst = new pt_con(pt_params);

		let record = {
			inst: pt_inst,
			name: pt_name,
		};

		let attrib_names = Object.keys(attribs);
		for (let i = 0; i < attrib_names.length; i++) {
			if (attrib_names[i] === 'name' || attrib_names[i] === 'type')
				throw new Error('illegal attribute "'+attrib_names[i]+'"');
			record[attrib_names[i]] = attribs[attrib_names[i]];
		}

		this.pltypes.insert(record);

		return pt_inst;

	};


	plugorg.prototype.add_plugin = function (ref, pl_params) {

		let plugin_con = typeof ref === 'string'
			? require(ref)
			: ref;

		let pl_name = plugin_con.prototype.po_name();

		let attribs = typeof plugin_con.prototype.po_attribs === 'function'
			? plugin_con.prototype.po_attribs()
			: {};

		let pt_name = typeof plugin_con.prototype.po_type === 'function'
			? plugin_con.prototype.po_type()
			: 'default';

		if (this.plugins({type:pt_name,name:pl_name}).get().length > 0)
			throw new Error('name clash, or already added (name "'+pl_name+'" type "'+pt_name+'")');

		let pt_inst = this.get_type({name:pt_name});

		if (pt_inst === undefined)
			throw new Error('plugin type "'+pt_name+'" not known');

		let plugin_inst = new plugin_con(pt_inst, pl_params);

		let valid = typeof pt_inst.po_validplugin === 'function'
			? pt_inst.po_validplugin(plugin_inst)
			: true;
		if (valid !== true)
			throw new Error('plugin type "'+pt_inst.po_name()+'" validation failed');

		let record = {
			inst: plugin_inst,
			name: pl_name,
			type: pt_name,
		};

		let attrib_names = Object.keys(attribs);
		for (let i = 0; i < attrib_names.length; i++) {
			if (attrib_names[i] === 'name' || attrib_names[i] === 'type')
				throw new Error('illegal attribute "'+attrib_names[i]+'"');
			record[attrib_names[i]] = attribs[attrib_names[i]];
		}

		this.plugins.insert(record);

		return plugin_inst;

	};


	plugorg.prototype.get_type = function (criteria) {

		let matches = this.get_types(criteria);

		if (matches.length === 0)
			return undefined;
		else if (matches.length === 1)
			return matches[0];
		else
			throw new Error('multiple results, not allowed');

	};


	plugorg.prototype.get_types = function (criteria) {

		return this.pltypes(criteria).distinct('inst');

	};


	plugorg.prototype.get_plugin = function (criteria) {

		let matches = this.get_plugins(criteria);

		if (matches.length === 0)
			return undefined;
		else if (matches.length === 1)
			return matches[0];
		else
			throw new Error('multiple results, now allowed');

	};


	plugorg.prototype.get_plugins = function (criteria) {

		return this.plugins(criteria).distinct('inst');

	};


	return plugorg;


})();


let plugorg_pt_default = (function() {


	let plugorg_pt_default = function plugorg_pt_default () {

	};


	plugorg_pt_default.prototype.po_name = function () {

		return 'default';

	};


	return plugorg_pt_default;


})();


/* istanbul ignore else */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg;
} else {
	window.plugorg = plugorg;
}


})();
