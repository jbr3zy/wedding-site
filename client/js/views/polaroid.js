var Marionette = require('backbone.marionette');
var Photo = require('../models/photo');
var Ripple = require('../utils/ripple');
var animate = require('velocity-commonjs');

var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default');

var PolaroidView = Marionette.ItemView.extend({
	src: "http://assets.nydailynews.com/polopoly_fs/1.1245686!/img/httpImage/image.jpg_gen/derivatives/article_970/afp-cute-puppy.jpg",
	animating: false,
	pswpElement: null,
	options: {
	    index: 0,
	    shareEl: false,
	    bgOpacity: 0.85,
	    fullscreenEl: false,
	    showHideOpacity:false,
	    hideAnimationDuration:0,
	    history:false
	},
	ui: {
		photo1: ".photo1",
		photo2: ".photo2",
		photo3: ".photo3",
		photoStack: ".photo-stack",
		next: "#next-button"
	},
	events: {
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

		return this;
	},
	openGallery: function() {
		var options = this.options;
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