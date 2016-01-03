var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');

var DrawerView = require('./drawer');
var responsiveNav = require('responsive-nav');

var MenuView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),
  el: "#nav-wrapper",
	ui: {
		rsvp: "#nav-rsvp",
    details: "#nav-details",
    accommodations: "#nav-accommodations"
	},
	events: function() {
    if ("ontouchstart" in document.documentElement) {
        return {
          "touchend @ui.accommodations": "openDrawer",
          "touchend @ui.details": "openDetails",
          "touchend @ui.rsvp": "openRsvp"
        }
    }
    return {
    	"mouseup @ui.accommodations": "openDrawer",
      "mouseup @ui.details": "openDetails",
      "mouseup @ui.rsvp": "openRsvp"
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
    this.ui.accommodations.addClass("active");
		new DrawerView({"title": "Accommodations"}).render();
	},
  openDetails: function() {
    this.ui.details.addClass("active");
    new DrawerView({"title": "Details"}).render();
  },
  openRsvp: function() {
    this.ui.rsvp.addClass("active");
    new DrawerView({"title": "RSVP"}).render();
  }
});

module.exports = MenuView;