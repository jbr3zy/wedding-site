var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var lightbox = require('lightbox2');
var locations = require('../locations');
var $ = require('jquery');

var PlaceModel = Backbone.Model.extend({
        defaults: {
            name: "",
            contact: "",
            sleeps: 0,
           	email: "",
           	phone: "",
           	website: "",
           	location: "",
           	polyline: ""
        },
        getMap: function() {
        	var url = "https://maps.googleapis.com/maps/api/staticmap?size=600x400&key=AIzaSyAqiK4YJp8Q3MmVHyByBGKOtmDJSLu7gSY";
        	url += "&markers=icon:http://chart.googleapis.com/chart?chst=d_map_spin%26chld=0.75%257C0%257CFE7569%257C14%257C_%257CFP%7C44.498416,-68.810202";
        	url += "&markers=%7C";
        	url += this.get("location");
        	url += "&path=weight:3%7Ccolor:blue%7Cenc:";
        	url += this.get("polyline");
        	return url;
        }
    });

var PlaceCollection = Backbone.Collection.extend({
        model: PlaceModel
    });

var PlaceItemView = Marionette.ItemView.extend({
        template: '#placeCardTemplate', 
        className: "card",
        ui: {
			name: ".card-title",
			phone: ".phone .value",
			sleeps: ".sleeps .value",
			contact: ".contact .value",
			email: ".email .value",
			website: ".website",
			button: ".button",
			location: ".map",

		},
        onRender: function() {
        	var contact = this.model.get("contact");
        	var phone = this.model.get("phone");
        	var email = this.model.get("email");
            var sleeps = this.model.get("sleeps");

        	var location = this.model.get("location");
        	var website = this.model.get("website");

        	this.ui.name.html(this.model.get("name"));

            if (sleeps == 0) {
                this.ui.sleeps.parent().addClass("hide");
            } else {
                this.ui.sleeps.html(sleeps);
            }

        	if (phone == "") {
        		this.ui.phone.parent().addClass("hide");
        	} else {
        		this.ui.phone.html(phone);
        		this.ui.phone.attr("href", "tel:"+ phone.replace(/-/g,""));
        	}

        	if (contact == "") {
        		this.ui.contact.parent().addClass("hide");
        	} else {
        		this.ui.contact.html(contact);
        	}

        	if (email == "") {
        		this.ui.email.parent().addClass("hide");
        	} else {
        		this.ui.email.html(email);
        		this.ui.email.attr("href", "mailto:"+ email);
        	}

        	if (location == "") {
        		this.ui.location.addClass("hide");
        	} else {
        		this.ui.location.attr("href", this.model.getMap());
        	}

        	if (website == "") {
        		this.ui.website.addClass("hide");
        	} else {
        		this.ui.website.attr("href", website);
        	}
        }
    });

var PlaceCollectionView = Marionette.CollectionView.extend({
		tagName: "div",
        childView: PlaceItemView
    });

var DirectionsView = Marionette.ItemView.extend({
	template: "#directionsTemplate",
	className: "acc",
	data: locations,
	ui: {
		holder: "#firstHolder"
	},
	events: {
		"click @ui.close": "closeDrawer",
		"click @ui.title": "hello"
	},
	initialize: function() {
		lightbox.option({
      		'resizeDuration': 250,
      		'fadeDuration': 250,
      		'showImageNumberLabel': false
    	});
    },
    onRender: function() {
    	this.bindUIElements();
		var placeCollection = new PlaceCollection(this.data);
		var view = new PlaceCollectionView({collection: placeCollection});
    	this.ui.holder.html(view.render().el);
    }
});

module.exports = DirectionsView;