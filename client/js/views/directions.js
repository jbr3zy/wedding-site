var Marionette = require('backbone.marionette');

var DirectionsView = Marionette.ItemView.extend({
	template: "#directionsTemplate",
	ui: {
		title: "#drawer-title",
		content: "#drawer-content",
		close: "#nav-button"
	},
	events: {
		"click @ui.close": "closeDrawer",
		"click @ui.title": "hello"
	},
	initialize: function() {
		//
    },
    onRender: function() {
		//
    }
});

module.exports = DirectionsView;