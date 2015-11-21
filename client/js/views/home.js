var Marionette = require('backbone.marionette');
var LogoView = require('./logo');
var PolaroidView = require('./polaroid');
var animate = require('velocity-commonjs');
var Radio = require('backbone.radio');
var $ = require('jquery');


var HomeView = Marionette.LayoutView.extend({
	el: "#home",

	dataChannel: Radio.channel('data'),

	ui: {
		polaroid: "#polaroid",
		logo: "#logo"
	},
	moveMe: function() {
  		animate(this.ui.logo, {
		    left: 200,
		}, {
		    duration: 250, 
		    easing: "easing"
		});
	},
	initialize: function() {
        this.listenTo(this.dataChannel, 'expand', this.moveMe);
    },

	render: function() {
		var self = this;
		this.bindUIElements();

		var view = new LogoView({el: this.ui.logo});
		view.render();
		new PolaroidView({el: this.ui.polaroid}).render();

		this.$el.fadeIn();

		return this;
	},

});

module.exports = HomeView;