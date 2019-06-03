# plugorg [![Build Status](https://travis-ci.org/mwri/plugorg.svg?branch=master)](https://travis-ci.org/mwri/plugorg) [![Coverage Status](https://coveralls.io/repos/github/mwri/plugorg/badge.svg?branch=master)](https://coveralls.io/github/mwri/plugorg?branch=master)

PlugOrg is a plugin organiser/manager. You can manage multiple sets of
plugins (by way of plugin types, optional if you only care about one
homogenous set of plugins), plugins can be loaded dynamically at any
time and thereafter listed or otherwise managed.

Plugin types can automatically verify plugins of that type when they are
added.

Plugins, and plugin types, may have attributes, to distinguish
them in arbitrary fashions.

## Quick example use case

Say you have an application with multiple components, and a menu to
select each one and want to separate the components as extensions, even
allowing for users or integrators to add their own.

One way to do this is as follows, first create a plugin type like this:

```javascript
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
		this.menu.append($('<ul><a href="component.html?name='+plugin.po_name()+'">'+plugin.menu_text()+'</a></ul>'));
        return true;
    };

    return plugorg_widget_pltype;

})();

module.exports = plugorg_widget_pltype;
```

This saves a DOM element `menu` when it is instantiated, verifies any plugin
added has certain methods available and when a conformant plugin is added it
appends a list item to the menu DOM.

Now create an actual plugin:

```javascript
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
            .append($('<div class="log_widget">blah blah blah</div>'));
	};

    return plugorg_log_widget_plugin;

})();

module.exports = plugorg_log_widget_plugin;
```

This declares a 'widget' plugin of name 'log', with `menu_text` and
`render` methods to support its use.

Now, in the app initialisation, the plugin organiser and widget plugin type
can be initialised like this:

```javascript
let plugorg = require('plugorg');

let plugins = new plugorg();

plugins.add_type(require('plugorg_widget_pltype'), menu);
```

Note the 'menu' DOM element is passed when the plugin type is initialised.
This is passed as a parameter to the plugin type constructor.

Now, a routine could take steps to see what plugins are available and add
them, or by some user action at any time thereafter a plugin may be added, but
in any case simply adding a plugin will modify the DOM such that the menu is
extended:

```javascript
plugins.add_plugin(require('plugorg_widget_plugin'));
```

And, given the link added to the menu, a DOM element may be rendered:

```javascript
// gets 'name' query string param
let component_name = get_name_param();

let component_plugin = plugins.get_plugin({
    type: 'widget',
    name: component_name,
});

component_plugin.render(container);
```

Here, the query parameter 'name' is sought and used to get the correct
plugin, which is invoked to render the page/element.

A fully working and more advanced version of this, with multiple plugins
is to be found in the demo directory, run a HTTP server for it and check
it out.

## Usage walk through

An instance of the plugin organiser is instantiated like this:

```javascript
let plugorg = require('plugorg');

let plugins = new plugorg();
```

Adding a plugin can be done like this:

```javascript
plugins.add_plugin(require('my_first_plugin'));
```

### Minimum plugin implementation

The implementation for **my_first_plugin** should, minimally, look something
like this:

```javascript
let my_first_plugin = (function() {

    let my_first_plugin = function my_first_plugin (params) {
    };

    my_first_plugin.prototype.po_name = function (ref) {
        return 'my_first_plugin';
    };

    return my_first_plugin;

})();

module.exports = my_first_plugin;
```

The export must be a constructor with a prototype function `po_name`, which
returns a string identifying the plugin, distinguishing it from all other
plugins of the same type (see below).

There are two implied functions, which because they are not included above
are taken as follows:

```javascript
    my_first_plugin.prototype.po_type = function (ref) {
        return 'default';
    };

    my_first_plugin.prototype.po_attribs = function (ref) {
        return {};
    };
```

The first, declares the name of the plugin type, default, which is the only
plugin type that exists out of the box.

The second, declares a set of key value pairs, and the plugin will be indexed
by them (see below).

### Plugin types

If the plugin example above implemented `po_type` as follows...

```javascript
    my_first_plugin.prototype.po_type = function (ref) {
        return 'my_first_pltype';
    };
```

...then when it is added, the plugin organiser expects to find a plugin type
with a name of 'my_first_pltype', and if it is not found an error will be
thrown.

Note that a plugin name is required to be unique for a given plugin type, so
you may not add two plugins with the same name if they are the same type, but
you may add two plugins with the same name if they are different types.

### Minimum plugin type implementation

The implementation of the out of the box plugin type called 'default' is
minimal (existing only to satisfy the demand for a type to exist for all
plugins for consistency in cases where the user does not actually require
plugin types) as follows:

```javascript
let plugorg_pt_default = (function() {

    let plugorg_pt_default = function plugorg_pt_default () {
    };

    plugorg_pt_default.prototype.po_name = function () {
        return 'default';
    };

    plugorg_pt_default.prototype.po_validplugin = function (plugin) {
        return true;
    };

    return plugorg_pt_default;

})();

module.exports = plugorg_pt_default;
```

So, an implementation of 'my_first_pltype' can copy this, changing the name.
The `po_validplugin` function may be omitted, which presumes the plugin type
has nothing to do to validate a newly added plugin of its type.

### Finding plugins

Getting a complete list of all plugins can be achieved by calling `get_plugins`.
This call returns an array of zero or more instantiated plugins:

```javascript
let all_plugins = plugins.get_plugins();
```

If you are using plugin types this probably never makes sense, as a list of
a particular type of plugin would generally be the most you would want. To
get all the plugins of a type with name 'jquery_widgets' do this:

```javascript
let all_plugins = plugins.get_plugins({type:'jquery_widgets'});
```

To get a particular plugin, of known name say, you can call the singular
method `get_plugin`, which is like `get_plugins` but returns a plugin
instance, not a list of plugins:

```javascript
let editor_plugin = plugins.get_plugin({type:'jquery_widgets',name:'editor'});
```

Omitting the `type` criteria here works as well, but this is technically
dangerous if you have multiple types, since there may be a cross type plugin
name clash!

Note that when you call `get_plugin`, if there are multiple matches, an
error is thrown, so you must know there is no more than one possible match
or you should use `get_plugins`. If there is no match, `undefined` is retuened.

#### Finding by attributes

If a plugin `po_attribs` method was implemented as follows...

```javascript
    jquery_widgets.prototype.po_attribs = function (ref) {
        return {
            group: 'interactive',
			size:  4
		};
    };
```

...then this plugin could also be 'found' using the attributes:

```javascript
let editor_plugin = plugins.get_plugin({type:'jquery_widgets',size:4});
```

Or, all 'interactive jQuery widgets could be found:

```javascript
let inter_jq_plugins = plugins.get_plugins({type:'jquery_widgets',group:'interactive'});
```

Any number of clauses may be added to `get_plugins` or `get_plugin`.

### Finding plugin types

This is much the same as finding plugins, the only different being types do
not have a type. Two methods exist, `get_type` and `get_types`, and valid
keys are 'name', and anything that may be returned by a type's `po_attribs`
method.
