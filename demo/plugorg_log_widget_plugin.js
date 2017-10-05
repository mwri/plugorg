(function () {


'use strict';


let plugorg_log_widget_plugin = (function() {

    let plugorg_log_widget_plugin = function plugorg_log_widget_plugin (pltype, params) {

		this.pltype = pltype;

    };

    plugorg_log_widget_plugin.prototype.po_type = function (ref) {

        return 'widget';

    };

    plugorg_log_widget_plugin.prototype.po_name = function (ref) {

        return 'log';

    };

	plugorg_log_widget_plugin.prototype.menu_text = function () {

		return 'Activity log';

	};

	plugorg_log_widget_plugin.prototype.render = function (container) {

        $(container)
			.empty()
			.append($('<div class="log_widget">Activity log renders this.</div>'));

	};

    return plugorg_log_widget_plugin;

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg_log_widget_plugin;
} else {
	window.plugorg_log_widget_plugin = plugorg_log_widget_plugin;
}


})();
