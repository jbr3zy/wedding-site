var Marionette = require('backbone.marionette')

var PolaroidView = Marionette.ItemView.extend({
	ui: {
		puppy: 'img',
	},
});

module.exports = PolaroidView;