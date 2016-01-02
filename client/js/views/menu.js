var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var DrawerView = require('./drawer');
var responsiveNav = require('responsive-nav');

var MenuView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),
  el: "#nav-wrapper",
	ui: {
		rsvp: "#nav-rsvp",
    directions: "#nav-directions",
    accommodations: "#nav-accommodations"
	},
	events: function() {
    if ("ontouchstart" in document.documentElement) {
        return {
          "touchend @ui.directions": "openDrawer"
        }
    }
    return {
    	"mouseup @ui.directions": "openDrawer"
    }
	},
	initialize: function() {
		// this.listenTo(this.dataChannel, 'open', this.moveOpen);
		// this.listenTo(this.dataChannel, 'close', this.moveClose);
	},
	render: function() {
		this.bindUIElements();
    // initiate responsive-nav
    responsiveNav(".nav-collapse", { // Selector
      insert: "after",
      animate: true, // Boolean: Use CSS3 transitions, true or false
      transition: 284, // Integer: Speed of the transition, in milliseconds
    });
		return this;
	},
	openDrawer: function() {
    this.ui.directions.addClass("active");
		new DrawerView().render();
	}
});

module.exports = MenuView;