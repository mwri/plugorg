(function () {


'use strict';


let plugorg_extra_widget_plugin = (function() {

    let plugorg_extra_widget_plugin = function plugorg_extra_widget_plugin (pltype, params) {

		this.pltype = pltype;

    };

    plugorg_extra_widget_plugin.prototype.po_type = function (ref) {

        return 'widget';

    };

    plugorg_extra_widget_plugin.prototype.po_name = function (ref) {

        return 'extra';

    };

	plugorg_extra_widget_plugin.prototype.menu_text = function () {

		return 'Extra stuff';

	};

	plugorg_extra_widget_plugin.prototype.render = function (container) {

        $(container)
			.empty()
			.append($('<div class="extra_widget">Extra plugin renders this.</div>'));

	};

    return plugorg_extra_widget_plugin;

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg_extra_widget_plugin;
} else {
	window.plugorg_extra_widget_plugin = plugorg_extra_widget_plugin;
}


})();
