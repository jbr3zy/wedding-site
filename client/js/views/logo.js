var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
var animate = require('velocity-commonjs');

var DrawerView = require('./drawer');

var LogoView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),

	ui: {
		title: "#title",
    directions: "#directions",
    buttons: ".button"
	},
	events: {
    	"click @ui.directions": "openDrawer"
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
      this.ui.directions.addClass("active");
  		new DrawerView().render();
  	},
  	moveOpen: function() {
  		this.moveMe(true);
  	},
  	moveClose: function() {
      this.ui.buttons.removeClass("active");
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