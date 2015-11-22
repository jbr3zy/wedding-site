var Backbone = require('backbone');

var Photo = Backbone.Model.extend({
	defaults: {
		loaded: false,
	},
	initialize: function(options) {
		var self = this;
		var img = new Image();

		img.onload = function() {
			self.set({loaded: true});
			if (typeof options.callback === "function") {
				options.callback();				
			}
		};
		img.setAttribute("src", options.src);
	}
});

module.exports = Photo;