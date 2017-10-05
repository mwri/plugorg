(function () {


'use strict';


let plugorg_widget_pltype = (function() {

    let plugorg_widget_pltype = function plugorg_widget_pltype (menu) {

		this.menu = $(menu);

    };

    plugorg_widget_pltype.prototype.po_name = function () {

        return 'widget';

    };

    plugorg_widget_pltype.prototype.po_validplugin = function (plugin) {

		if (typeof plugin.menu_text !== 'function')
			throw new Error('bad widget plugin "'+plugin.po_name()+'", no "menu_text" method');
		if (typeof plugin.render !== 'function')
			throw new Error('bad widget plugin "'+plugin.po_name()+'", no "render" method');

		this.menu.append($('<ul><a href="index.html?name='+plugin.po_name()+'">'+plugin.menu_text()+'</a></ul>'));

		return true;

    };

    return plugorg_widget_pltype;

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = plugorg_widget_pltype;
} else {
	window.plugorg_widget_pltype = plugorg_widget_pltype;
}


})();
