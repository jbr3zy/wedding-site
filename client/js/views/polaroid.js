var Marionette = require('backbone.marionette');

var PolaroidView = Marionette.ItemView.extend({
	ui: {
		puppy: 'img',
	},
	render: function() {
		this.bindUIElements();
		return this;
	},
});

module.exports = PolaroidView;