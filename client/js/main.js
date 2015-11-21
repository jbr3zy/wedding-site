var App = require('./app');
var loadCSS = require('./utils/load-css');
var onloadCSS = require('./utils/onload-css');

var options = {
  something: "some value1",
  another: "#some-selector"
};

var myapp = new App(options);

// Get those styles in there
setTimeout(function() {
	var styles = loadCSS('public/css/styles.min.css');
	onloadCSS(styles, function() {
		myapp.start();
	});
}, 1500);
