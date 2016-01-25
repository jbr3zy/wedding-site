var App = require('./app');
var loadCSS = require('./utils/load-css');
var onloadCSS = require('./utils/onload-css');
var photos = require('./data');
var Cookies = require('js-cookie');
var Radio = require('backbone.radio');

var _ = require('underscore');
var $ = require('jquery');

window.dataChannel = Radio.channel('dataChannel');

var options = {
  something: "some value1",
  another: "#some-selector"
};

var myapp = new App(options);

window.pswpItems = _.shuffle(photos);
var imageSource = window.pswpItems[0].src;

var reqCount = 0;
function checkReqs() {
	reqCount += 1;

	if (reqCount == 3) {
		$('.photo1').css('background-image', 'url(' + imageSource + ')');
		clearTimeout(window.loaderTimer);
		$('.loader').fadeOut();
		myapp.start();
	}
}

window.loaderTimer = setTimeout(function() {
   $('.loader').fadeIn();
}, 450);

var code = window.location.pathname.replace(/\//g, '');
if (!code) {
	code = Cookies.get('code')
} else {
	window.openRsvp = true;
}

if (code) {
	window.rsvpCode = code;
	window.longAjax = setTimeout(function() {
   		checkReqs();  // Allow start for long-running AJAX
	}, 3500);

	$.ajax({
	  type: "GET",
	  url: "/api/rsvp?code=" + code,
	  timeout: 12000
	}).done(function(response) {
	  window.guestData = response;
	  Cookies.set('code', response.code);
	  clearTimeout(window.longAjax);
	  window.dataChannel.trigger('dataLoaded');
	  checkReqs();
	});
} else {
	checkReqs();
}

// Get those styles in there
var styles = loadCSS('/public/css/styles.min.css');
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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-71949722-1', 'auto');
ga('send', 'pageview');

// $.ajax({
//   type: "POST",
//   url: "/api/rsvp",
//   data: JSON.stringify(data),
//   dataType: "json",
//   contentType: "application/json"
// }).done(function(response) {
//   console.log(response);
// });
