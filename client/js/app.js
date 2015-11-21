var Marionette = require('backbone.marionette');
var RootView = require('./views/root');

var App = Marionette.Application.extend({
	options: null,
	initialize: function(options) {
		this.options = options;
	},
	start: function() {
		this.rootView = new RootView(this.options);
		this.rootView.render();
	}
});

module.exports = App;
