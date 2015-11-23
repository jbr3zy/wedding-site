var Marionette = require('backbone.marionette');
var Photo = require('../models/photo');
var animate = require('velocity-commonjs');

var PolaroidView = Marionette.ItemView.extend({
	src: "http://assets.nydailynews.com/polopoly_fs/1.1245686!/img/httpImage/image.jpg_gen/derivatives/article_970/afp-cute-puppy.jpg",
	animating: false,
	ui: {
		photo1: ".photo1",
		photo2: ".photo2",
		photo3: ".photo3",
		photoStack: ".photo-stack"
	},
	events: {
		"hover @ui.photoStack": "animateHover",
		"mouseenter": "animateHoverOn",
		"mouseleave": "animateHoverOff",
	},
	render: function() {
		this.bindUIElements();

		var photo = new Photo({src: this.src});
		photo.on("change:loaded", this.setImage);

		console.log(this.ui.photoStack);

		return this;
	},
	setImage: function() {
		console.log('hey');
	},
	animateHoverOn: function() {
		console.log('on');
		if (this.animating){
			animate(this.ui.photoStack, "stop").animate(this.ui.photoStack, "reverse",{ duration:80});
			this.animating = false;
		} else {
			animate(this.ui.photoStack, {
			    top: -10,
			}, {
			    duration: 100,
			    easing: "ease-in",
				begin: function(){
				  this.animating = true;
				},
				complete: function(){
				  this.animating = false;
				}
			});
			animate(this.ui.photo1, {
			    rotateZ: ["10deg", "9deg"],
			    left: "45"
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-in",
			});
			animate(this.ui.photo3, {
			    rotateZ: ["-9deg", "-8deg"],
			    left: "-5"
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-in",
			});
		}
	},
	animateHoverOff: function() {
		console.log('off');
		if (this.animating){
			animate(this.ui.photoStack, "stop").animate(this.ui.photoStack, "reverse",{ duration:80});
			this.animating = false;
		} else {
			animate(this.ui.photoStack, {
			    top: 0,
			}, {
			    duration: 100,
			    easing: "ease-out",
				begin: function(){
				  this.animating = true;
				},
				complete: function(){
				  this.animating = false;
				}
			});
			animate(this.ui.photo1, {
			    rotateZ: "9deg",
			    left: "40"
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-out",
			});
			animate(this.ui.photo3, {
			    rotateZ: "-8deg",
			    left: "0"
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-out",
			});
		}
	}
});

module.exports = PolaroidView;