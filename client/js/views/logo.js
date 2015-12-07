var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
var animate = require('velocity-commonjs');

var DrawerView = require('./drawer');

var LogoView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),

	ui: {
		title: "#title",
	},
	events: {
    	"click @ui.title": "openDrawer"
  	},
  	initialize: function() {
  		this.listenTo(this.dataChannel, 'open', this.moveOpen);
  		this.listenTo(this.dataChannel, 'close', this.moveClose);
  	},
	render: function() {
		this.bindUIElements();
		return this;
	},
  	openDrawer: function() {
  		new DrawerView().render();
  	},
  	moveOpen: function() {
  		this.moveMe(true);
  	},
  	moveClose: function() {
  		this.moveMe(false);
  	},
  	moveMe: function(open) {
  		console.log(open);
  		animate(this.$el, {
		    left: (open ? "1%" : "50%"),
		}, {
		    duration: 125,
		    queue: false 
		});
  	}
});

module.exports = LogoView;