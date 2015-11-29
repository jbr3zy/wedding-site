var Marionette = require('backbone.marionette');
var Photo = require('../models/photo');
var Ripple = require('../utils/ripple');
var animate = require('velocity-commonjs');

var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default');

var PRELOAD_FACTOR = 2;

var PolaroidView = Marionette.ItemView.extend({
	src: "http://assets.nydailynews.com/polopoly_fs/1.1245686!/img/httpImage/image.jpg_gen/derivatives/article_970/afp-cute-puppy.jpg",
	animating: false,
	pswpElement: null,
	photoStore: [],
	index: 0,
	options: {
	    index: 0,
	    shareEl: false,
	    bgOpacity: 0.75,
	    fullscreenEl: false,
	    showHideOpacity:false,
	    hideAnimationDuration:0,
	    history:false
	},
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
	render: function() {
		this.bindUIElements();

		var photo = new Photo({src: this.src});
		photo.on("change:loaded", this.setImage);

		Ripple.init(this.ui.next[0], 0.40);

		this.pswpElement = document.querySelectorAll('.pswp')[0];

		this.preloadImages();

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
	nextPhoto: function() {
		this.preloadImages();
		this.index = (this.index + 1) % this.photoStore.length;

		var photo = this.photoStore[this.index];
		var frame = this.ui.photoFrame;
		console.log(frame);
		var image = this.ui.photo1;

		animate(frame, {
			backgroundColor: "#ffffff",
			backgroundColorAlpha: 1
		}, {
			duration: 800,
			queue: false,
			easing: "ease-in",
			complete: function() {
				image.css('background-image', 'url(' + photo.src + ')');
				animate(frame, {
					backgroundColor: "#ffffff",
					backgroundColorAlpha: 0
				}, {
					duration: 1800,
					queue: false,
					easing: "ease-out"
				});
		  	}
		});
	},
	openGallery: function() {
		var options = this.options;
		options.index = this.index;
		options.getThumbBoundsFn = this.thumbBounds;
		var gallery = new PhotoSwipe(this.pswpElement, PhotoSwipeUI, window.pswpItems, options);
		gallery.init();
	},
	setImage: function() {
		console.log('hey');
	},
    thumbBounds: function(index) {
    	console.log('alkjsdf');
    	console.log(index);
        var thumbnail = document.getElementById('photo1'), // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect(); 

        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
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