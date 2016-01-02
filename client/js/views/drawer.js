var Marionette = require('backbone.marionette');
var animate = require('velocity-commonjs');

var DirectionsView = require('./directions');

var Radio = require('backbone.radio');
var $ = require('jquery');


var DrawerView = Marionette.LayoutView.extend({
	template: "#drawerTemplate",
	id: "drawer",
	dataChannel: Radio.channel('drawer'),

	ui: {
		title: "#drawer-title",
		content: "#drawer-content",
		close: "#nav-button"
	},
	events: {
		"click @ui.close": "closeDrawer",
		"click @ui.title": "hello"
	},
	regions: {
		"content": "#drawer-content"
	},
	hello: function() {
		console.log('hello');
	},
	isMobile: function() {
		return (window.innerWidth <= 768)
	},
	openDrawer: function() {
		console.log(this.$el.width());
		if (!this.isMobile()) {
			this.dataChannel.trigger('open');
		}
		animate(this.$el, "finish");
		animate(this.$el, {
			left: (this.isMobile() ? "0%" : "45%"),
		}, {
			duration: 825,
			easing: [500, 20],
			queue: false
		});  
	},
	closeDrawer: function() {
		var self = this;
		if (!self.isMobile()) {
			self.dataChannel.trigger('close');
		}
		animate(self.$el, "finish");
		animate(self.$el, {
			left: "100%"
		}, {
			duration: 325,
			easing: "easeOutQuart",
			queue: false,
			complete: function() {
				self.destroy();
			}
		}); 
	},
	initialize: function() {
		//
    },
    onRender: function() {
    	$("#wrapper").append(this.el);
    	this.getRegion("content").show(new DirectionsView());
    	/// debugger;
    	this.openDrawer();
    }
});

module.exports = DrawerView;