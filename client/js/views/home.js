var Marionette = require('backbone.marionette');
var LogoView = require('./logo');
var PolaroidView = require('./polaroid');
var animate = require('velocity-commonjs');


var HomeView = Marionette.LayoutView.extend({
	el: "#home",
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
	render: function() {
		var self = this;
		this.bindUIElements();

		var view = new LogoView({el: this.ui.logo});
		view.render();
		new PolaroidView({el: this.ui.polaroid}).render;

		view.on("expand", function(args){
  			self.moveMe();
		});

		return this;
	},

});

module.exports = HomeView;