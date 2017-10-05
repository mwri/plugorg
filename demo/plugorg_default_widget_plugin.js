(function () {


'use strict';


let plugorg_default_widget_plugin = (function() {

    let plugorg_default_widget_plugin = function plugorg_default_widget_plugin (pltype, params) {

		this.pltype = pltype;

    };

    plugorg_default_widget_plugin.prototype.po_type = function (ref) {

        return 'widget';

    };

    plugorg_default_widget_plugin.prototype.po_name = function (ref) {

        return 'default';

    };

	plugorg_default_widget_plugin.prototype.menu_text = function () {

		return 'Default';

	};

	plugorg_default_widget_plugin.prototype.render = function (container) {

        $(container)
			.empty()
			.append($('<div class="default_widget">Default plugin renders this.</div>'));

	};

    return plugorg_default_widget_plugin;

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg_default_widget_plugin;
} else {
	window.plugorg_default_widget_plugin = plugorg_default_widget_plugin;
}


})();
