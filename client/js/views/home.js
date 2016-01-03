var Marionette = require('backbone.marionette');
var LogoView = require('./logo');
var PolaroidView = require('./polaroid');
var animate = require('velocity-commonjs');
var Radio = require('backbone.radio');
var $ = require('jquery');


var HomeView = Marionette.LayoutView.extend({
	el: "#home",

	dataChannel: Radio.channel('drawer'),

	ui: {
		polaroid: "#polaroid",
		logo: "#logo",
		shade: "#shade"
	},
	initialize: function() {
		this.listenTo(this.dataChannel, 'open', this.shadeOn);
		this.listenTo(this.dataChannel, 'close', this.shadeOff);
    },

	render: function() {
		var self = this;
		this.bindUIElements();

		var view = new LogoView({el: this.ui.logo});
		view.render();
		new PolaroidView({el: this.ui.polaroid}).render();

		this.$el.fadeIn(1200);
		$('#nav-wrapper').fadeIn(1200);

		return this;
	},

	shadeOn: function() {
		this.turnShade(true);
	},

	shadeOff: function() {
		this.turnShade(false);
	},

	turnShade: function(show) {
		if (show) {
			this.ui.shade.fadeIn(250);
		} else {
			this.ui.shade.fadeOut();
		}
	}

});

module.exports = HomeView;