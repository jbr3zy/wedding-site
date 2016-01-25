var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
var animate = require('velocity-commonjs');

var DrawerView = require('./drawer');

var LogoView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),

	ui: {
		title: "#title",
    directions: "#directions",
    buttons: ".button",
    rsvp: "#rsvp",
    details: "#details"
	},
	events: {
    	"click @ui.directions": "openDrawer",
      "click @ui.rsvp": "openRsvp",
      "click @ui.details": "openDetails"
  	},
  	initialize: function() {
  		this.listenTo(this.dataChannel, 'open', this.moveOpen);
  		this.listenTo(this.dataChannel, 'close', this.moveClose);
  	},
  	render: function() {
  		this.bindUIElements();

      if (window.openRsvp) {
        var self = this;
        setTimeout(function() {
          self.openRsvp();
        }, 550);
      }
  		return this;
  	},
    openRsvp: function() {
      this.ui.rsvp.addClass("active");
      new DrawerView({"title":"Rsvp"}).render();
    },
    openDetails: function() {
      this.ui.details.addClass("active");
      new DrawerView({"title":"Details"}).render();
    },
  	openDrawer: function() {
      this.ui.directions.addClass("active");
      new DrawerView({"title":"Accommodations"}).render();
  	},
  	moveOpen: function() {
  		this.moveMe(true);
  	},
  	moveClose: function() {
      this.ui.buttons.removeClass("active");
  		this.moveMe(false);
  	},
  	moveMe: function(open) {
      var width = window.innerWidth;
      var buffer = this.isTablet() ? 420 : 532;
      var leftPoint = width*.45 - buffer;
      if (!open) {
        leftPoint = width*.5;
      }
  		animate(this.$el, {
		    left: leftPoint/width*100 + "%",
  		}, {
  		    duration: 125,
  		    queue: false 
  		});
  	},
    isTablet: function() {
      return (window.innerWidth < 960);
    }
});

module.exports = LogoView;