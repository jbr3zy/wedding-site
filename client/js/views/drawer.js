var Marionette = require('backbone.marionette');
var animate = require('velocity-commonjs');
var Radio = require('backbone.radio');
var $ = require('jquery');


var DrawerView = Marionette.LayoutView.extend({
	el: "#drawer",

	dataChannel: Radio.channel('drawer'),

	ui: {
		title: "#drawer-title",
		content: "#drawer-content",
		close: "#nav-button"
	},
	events: {
		"click @ui.close": "closeDrawer"
	},
	openDrawer: function() {
		console.log(this.$el.width());
		this.dataChannel.trigger('open');
		animate(this.$el, "finish");
		animate(this.$el, {
			left: (window.innerWidth < 768 ? "0%" : "45%"),
		}, {
			duration: 625,
			easing: [500, 20],
			queue: false
		});  
	},
	closeDrawer: function() {
		this.dataChannel.trigger('close');
		animate(this.$el, "finish");
		animate(this.$el, {
			left: "100%"
		}, {
			duration: 300,
			easing: "easeOutQuart",
			queue: false
		});  
	},
	initialize: function() {
		//
    },

	render: function() {
		var self = this;
		this.bindUIElements();

		this.openDrawer();

		return this;
	},

});

module.exports = DrawerView;