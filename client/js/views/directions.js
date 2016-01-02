var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

var PlaceModel = Backbone.Model.extend({
        defaults: {
            name: ''
        }
    });

var PlaceCollection = Backbone.Collection.extend({
        model: PlaceModel
    });

var PlaceItemView = Marionette.ItemView.extend({
        template: '#placeCardTemplate', 
        className: "card",
        ui: {
			title: ".card-title"
		},
        onRender: function() {
        	this.ui.title.html(this.model.get("name"));
        }
    });

var PlaceCollectionView = Marionette.CollectionView.extend({
		tagName: "div",
        childView: PlaceItemView
    });

var DirectionsView = Marionette.ItemView.extend({
	template: "#directionsTemplate",
	data: [{"name": "one"}, {"name": "two"}, {"name": "three"}],
	ui: {
		holder: "#firstHolder"
	},
	events: {
		"click @ui.close": "closeDrawer",
		"click @ui.title": "hello"
	},
	initialize: function() {
    },
    onRender: function() {
    	this.bindUIElements();
		var placeCollection = new PlaceCollection(this.data);
		var view = new PlaceCollectionView({collection: placeCollection});
    	this.ui.holder.html(view.render().el);
    }
});

module.exports = DirectionsView;