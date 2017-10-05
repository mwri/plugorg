(function () {


'use strict';


let plugorg_ctrlpanel_widget_plugin = (function() {

    let plugorg_ctrlpanel_widget_plugin = function plugorg_ctrlpanel_widget_plugin (pltype, params) {

		this.pltype = pltype;

    };

    plugorg_ctrlpanel_widget_plugin.prototype.po_type = function (ref) {

        return 'widget';

    };

    plugorg_ctrlpanel_widget_plugin.prototype.po_name = function (ref) {

        return 'ctrlpanel';

    };

	plugorg_ctrlpanel_widget_plugin.prototype.menu_text = function () {

		return 'Control panel';

	};

	plugorg_ctrlpanel_widget_plugin.prototype.render = function (container) {

        $(container)
			.empty()
			.append($('<div class="ctrlpanel_widget">Control panel plugin renders this.</div>'));

	};

    return plugorg_ctrlpanel_widget_plugin;

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg_ctrlpanel_widget_plugin;
} else {
	window.plugorg_ctrlpanel_widget_plugin = plugorg_ctrlpanel_widget_plugin;
}


})();
