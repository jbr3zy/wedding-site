var Marionette = require('backbone.marionette');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default');

var GalleryView = Marionette.ItemView.extend({
	pswpElement: null,
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
	initialize: function(options) {
				this.pswpElement = document.querySelectorAll('.pswp')[0];
		if (options.index) {
			this.index = options.index;
		}
		this.openGallery();
	},
	openGallery: function() {
		var options = this.options;
		options.index = this.index;
		options.getThumbBoundsFn = this.thumbBounds;
		var gallery = new PhotoSwipe(this.pswpElement, PhotoSwipeUI, window.pswpItems, options);
		gallery.init();
	},
    thumbBounds: function(index) {
        var thumbnail = document.getElementById('photo1'), // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect(); 

        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
    }
});

module.exports = GalleryView;