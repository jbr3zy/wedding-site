var Marionette = require('backbone.marionette');
var Photo = require('../models/photo');

var PolaroidView = Marionette.ItemView.extend({
	src: "http://assets.nydailynews.com/polopoly_fs/1.1245686!/img/httpImage/image.jpg_gen/derivatives/article_970/afp-cute-puppy.jpg",
	ui: {
		photo: "img",
	},
	render: function() {
		this.bindUIElements();

		var photo = new Photo({src: this.src});
		photo.on("change:loaded", this.setImage);

		return this;
	},
	setImage: function() {
		console.log('hey');
	}
});

module.exports = PolaroidView;