var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var LogoView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('data'),

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

  	bark: function() {
  		this.dataChannel.trigger('expand');
  	}
});

module.exports = LogoView;