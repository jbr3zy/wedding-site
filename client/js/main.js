var App = require('./app');
var loadCSS = require('./utils/load-css');
var onloadCSS = require('./utils/onload-css');
var photos = require('./data');

var _ = require('underscore');
var $ = require('jquery');

var options = {
  something: "some value1",
  another: "#some-selector"
};

var myapp = new App(options);

window.pswpItems = photos;
var imageSource = photos[0].src;

var reqCount = 0;
function checkReqs() {
	if (reqCount > 0) {
		myapp.start();
		$('.photo1').css('background-image', 'url(' + imageSource + ')');  
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
