var Marionette = require('backbone.marionette');
var Photo = require('../models/photo');
var Ripple = require('../utils/ripple');
var animate = require('velocity-commonjs');
var Radio = require('backbone.radio');
var $ = require('jquery');


var Gallery = require('./gallery');

var PRELOAD_FACTOR = 2;

var PolaroidView = Marionette.ItemView.extend({
	dataChannel: Radio.channel('drawer'),
	animating: false,
	photoStore: [],
	index: 0,
	ui: {
		photo1: ".photo1",
		photo2: ".photo2",
		photo3: ".photo3",
		photoFrame: "#photo-frame",
		photoStack: ".photo-stack",
		next: "#next-button"
	},
	events: {
		"click @ui.next": "nextPhoto",
		"click @ui.photo1": "openGallery",
		"hover @ui.photoStack": "animateHover",
		"mouseenter": "animateHoverOn",
		"mouseleave": "animateHoverOff",
	},
	initialize: function() {
		this.listenTo(this.dataChannel, 'open', this.moveOpen);
		this.listenTo(this.dataChannel, 'close', this.moveClose);
	},
	moveOpen: function() {
		this.moveMe(true);
	},
	moveClose: function() {
		this.moveMe(false);
	},
	moveMe: function(open) {
  		animate(this.$el, {
		    left: (open ? -400 : "50%"),
		}, {
		    duration: 125,
		    queue: false
		});
  	},
	render: function() {
		var self = this;
		self.bindUIElements();

		Ripple.init(self.ui.next[0], 0.40);

		self.preloadImages();
		setTimeout(function() {
			self.autoPhoto();
		}, 30000);

		return this;
	},
	preloadImages: function() {
		var preloadState = this.photoStore.length;
		var preloadDiff = (window.pswpItems.length - preloadState);
		var preloadNum = Math.min(preloadDiff, PRELOAD_FACTOR);

		for (var i = 0; i < preloadNum; i++) {
			var photo = window.pswpItems[preloadState + i];
			this.photoStore.push(new Photo({src: photo.src}));
		}
	},
	autoPhoto: function() {
		var self = this;
		if ($(".pswp").first().attr("aria-hidden") == "true") {
			self.nextPhoto();
		}
		setTimeout(function() {
			self.autoPhoto();
		}, 60000);
	},
	nextPhoto: function() {
		this.preloadImages();
		this.index = (this.index + 1) % this.photoStore.length;

		var photo = this.photoStore[this.index];
		var frame = this.ui.photoFrame;
		var image = this.ui.photo1;

		animate(frame, {
			backgroundColor: "#ffffff",
			backgroundColorAlpha: 1
		}, {
			duration: 50,
			queue: false,
			complete: function() {
				image.css('background-image', 'url(' + photo.src + ')');
				animate(frame, {
					backgroundColor: "#ffffff",
					backgroundColorAlpha: 0
				}, {
					duration: 1000,
					queue: false,
					easing: "ease-out"
				});
		  	}
		});
	},
	openGallery: function() {
		new Gallery({index: this.index});
	},
	setImage: function() {
	},
	animateHoverOn: function() {
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
			animate(this.ui.next, {
			    opacity: 1
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-in",
			});
		}
	},
	animateHoverOff: function() {
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
			animate(this.ui.next, {
			    opacity: 0,
			}, {
			    duration: 100,
			    queue: false,
			    easing: "ease-out",
			});
		}
	}
});

module.exports = PolaroidView;