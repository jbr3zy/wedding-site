var Marionette = require('backbone.marionette');
var HomeView = require('./home');
var MenuView = require('./menu');

var RootView = Marionette.LayoutView.extend({
	phrase: null,

	el: 'body',

	ui: {
		home: "#home",
	},

	initialize: function (options) {
		this.phrase = options.something;
	},

	render: function() {
		console.log(this.phrase);

		new HomeView().render();
		new MenuView().render();

		return this;
	}
});

module.exports = RootView;