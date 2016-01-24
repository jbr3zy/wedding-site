var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var $ = require('jquery');

var GuestModel = Backbone.Model.extend({
        defaults: {
            name: "",
            meal: null,
            attendance: null,
           	isPlusOne: false,
           	id: null
        },
        toDict: function() {
            var data = {"name": this.get("name")};
            if (this.get("meal") != null) {
                data["meal"] = this.get("meal");
            }
            if (this.get("attendance") != null) {
                data["attendance"] = this.get("attendance");
            }
            if (this.get("id") != null) {
                data["id"] = this.get("id");
            }
            return data;
        }
    });

var GuestCollection = Backbone.Collection.extend({
        model: GuestModel
    });

var GuestItemView = Marionette.ItemView.extend({
        template: '#guestCardTemplate', 
        className: "card",
        ui: {
			name: ".name",
            label: ".name-label",
            attendance: ".attendance",
            meal: ".meal",
            attendanceContainer: ".attendance-container",
            mealContainer: ".meal-container"
		},
        events: {
            "click @ui.label": "focusName",
            "click @ui.attendance": "setAttendance",
            "click @ui.meal": "setMeal"
        },
        setAttendance: function(e) {
            this.ui.attendance.removeClass("selected");
            e.target.className += " selected";

            var value = Number(e.target.getAttribute("data-value"));
            this.model.set("attendance", value);

            if (value == 1) {
                this.ui.mealContainer.removeClass("disabled");
            } else {
                this.ui.mealContainer.addClass("disabled");
                this.ui.meal.removeClass("selected");
            }
        },
        setMeal: function(e) {
            this.ui.meal.removeClass("selected");
            e.target.className += " selected";

            var value = Number(e.target.getAttribute("data-value"));
            this.model.set("meal", value);
        },
        focusName: function() {
            this.ui.name.focus();
        },
        onRender: function() {
            var self = this;

            if (!self.model.get("isPlusOne")) {
                self.ui.name.attr("disabled","disabled");
                self.ui.label.hide();
            }

        	var name = self.model.get("name");
            if (name != "") {
                self.ui.name.attr("value", name);
                self.ui.attendanceContainer.removeClass("disabled");
            }

            self.ui.name.on("focus", function() {
                self.ui.label.fadeOut(200);
            });
            self.ui.name.on("focusout", function() {
                if (!self.ui.name.val()) {
                    self.ui.label.fadeIn(200);
                }
            });

            self.ui.name.keyup(function() {
                self.ui.attendanceContainer.removeClass("disabled");
            });
        }
    });

var GuestCollectionView = Marionette.CollectionView.extend({
		tagName: "div",
        childView: GuestItemView
    });

var RsvpView = Marionette.ItemView.extend({
	template: "#rsvpTemplate",
    collection: null,
	ui: {
		holder: "#firstHolder"
	},
    onRender: function() {
    	this.bindUIElements();

        var data = window.guestData.guests;
        var plusOne = {"name":"", "isPlusOne":true};
        data.push(plusOne);
		var guestCollection = new GuestCollection(data);
        this.collection = guestCollection;

		var view = new GuestCollectionView({collection: guestCollection});
    	this.ui.holder.html(view.render().el);
    }
});

module.exports = RsvpView;