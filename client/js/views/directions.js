var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var lightbox = require('lightbox2');
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

        	var location = this.model.get("location");
        	var website = this.model.get("website");

        	this.ui.name.html(this.model.get("name"));
        	this.ui.sleeps.html(this.model.get("sleeps"));

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
	data: [
		{
		"name": "Cape Jellison Cottage",
		"address": "",
		"contact": "Lisa",
		"sleeps": 6,
		"email": "thetripps1987@gmail.com",
		"phone": "207-223-8805",
		"website": "http://www.vacationhomerentals.com/Stockton-Springs/proID-67831/",
		"location": "44.479592,-68.836278",
		"polyline": "slnnGzqccLkGbBu@Xm@^UN{@|@_DdEMTGTA^@^XbA|E`MvB|FVhAh@lCp@vC@`@GXOPu@VuBR_CLm@Hq@Ps@h@kI~HsAnAgAp@yK|JeVjUwEgLoAeEk@yAe@m@}AiA?}ICmCGwASgC]eC_@mBwH_\\_Jq_@gBsFgAqCaBiDaIgO_Rq]eMyUiH{MsB}DRYb@aEPkBBs@DmBFuJAsRrBQlJk@~HGhBMvAKvHjBz@HlBCn@Ep@?fCd@"
		},
		{
		"name": "Compass Rose Cottage",
		"address": "",
		"contact": "",
		"sleeps": 5,
		"email": "mainecottages@hotmail.com",
		"phone": "1-800-930-2561",
		"website": "http://www.onthewaterinmaine.com/vacation-rental-home.asp?PageDataID=45035",
		"location": "44.498797,-68.808704",
		"polyline": "sdrnGre~bL^N`@V\\f@F\\BZGZITKJi@VyAZfCd@"
		}
		],
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
      		'fadeDuration': 250
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