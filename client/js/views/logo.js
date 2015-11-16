var Marionette = require('backbone.marionette');

var LogoView = Marionette.ItemView.extend({
	ui: {
		puppy: 'img',
	},
	render: function() {
		console.log('hi');
		this.bindUIElements();
		return this;
	},

	events: {
    	"click @ui.puppy": "bark"
  	},

  	triggers: {
    	"click @ui.puppy": "expand"
  	},

  	bark: function() {

  	}
});

module.exports = LogoView;