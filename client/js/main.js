var App = require('./app');
var loadCSS = require('./utils/load-css');
var onloadCSS = require('./utils/onload-css');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI = require('photoswipe/dist/photoswipe-ui-default.js');

var $ = require('jquery');

var options = {
  something: "some value1",
  another: "#some-selector"
};

var imageSource = "https://drive.google.com/uc?id=0B0HS5TH7JBQLMDE0YkFMeGw2VUU";

var myapp = new App(options);

var reqCount = 0;
function checkReqs() {
	if (reqCount > 0) {
		myapp.start();
		console.log($('.photo1'));
		$('.photo1').attr('src', imageSource);
	} else {
		reqCount += 1;
	}
}

// Get those styles in there
var styles = loadCSS('public/css/styles.min.css');
onloadCSS(styles, function() {
	checkReqs();
});
loadCSS('https://fonts.googleapis.com/icon?family=Material+Icons');

// Pre-load the first image
var imageLoaded = function() {
	checkReqs();
}
var image = new Image();
image.onload = imageLoaded;
image.onerror = imageLoaded;
image.src = imageSource;



var pswpElement = document.querySelectorAll('.pswp')[0];

// build items array
var items = [
    {
        src: imageSource,
        msrc: imageSource,
        w: 820,
        h: 820
    },
    {
        src: 'https://placekitten.com/1200/900',
        w: 1200,
        h: 900
    }
];

// define options (if needed)
var options = {
    // optionName: 'option value'
    // for example:
    index: 0, // start at first slide
    shareEl: false,
    bgOpacity: 0.85,
    fullscreenEl: false,
    showHideOpacity:false,
    hideAnimationDuration:0,
    history:false,
    getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = document.getElementById('photo1'), // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

};

// Initializes and opens PhotoSwipe
$('#photo1').click(function(){
	var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);
	console.log('hi');
	gallery.init();
});
