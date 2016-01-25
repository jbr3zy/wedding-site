var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var $ = require('jquery');
var Radio = require('backbone.radio');
var animate = require('velocity-commonjs');


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

            if (value == 1) {
                this.ui.mealContainer.removeClass("disabled");
                if (this.model.get("attendance") != 1) {
                    $(e.target).siblings(".stars").fadeTo(150, 0.8, function() {
                        $(e.target).siblings(".stars").fadeOut(650);
                    });
                }
            } else {
                this.ui.mealContainer.addClass("disabled");
                this.ui.meal.removeClass("selected");
            }
            this.model.set("attendance", value);
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

            var attendance = self.model.get("attendance");
            var meal = self.model.get("meal");

            if (attendance && attendance == 1) {
                this.ui.attendanceContainer.find(".yes").addClass("selected");
                this.ui.mealContainer.removeClass("disabled");

                if (meal && meal >= 0) {
                    this.ui.mealContainer.children(".meal" + meal).addClass("selected");
                }
            }

            if (!self.model.get("isPlusOne")) {
                self.ui.name.attr("disabled","disabled");
                self.ui.label.hide();
            }

        	var name = self.model.get("name");
            if (name != "") {
                self.ui.name.attr("value", name);
                self.ui.label.hide();
                self.ui.attendanceContainer.removeClass("disabled");
            }

            self.ui.name.on("focus", function() {
                self.ui.label.fadeOut(200);
            });
            self.ui.name.on("focusout", function() {
                if (!self.ui.name.val()) {
                    self.ui.label.fadeIn(200);
                    self.ui.attendanceContainer.addClass("disabled");
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
    dataChannel: Radio.channel('dataChannel'),
	ui: {
		holder: "#firstHolder",
        loading: "#rsvp-loading",
        noCode: "#no-invite-msg",
        notes: "#rsvp-notes"
	},
    onRender: function() {
    	this.bindUIElements();

        if (!window.rsvpCode) {
            this.ui.noCode.show();
            this.ui.notes.hide();
            return;
        }

        if (!window.guestData) {
            this.ui.loading.show();
            this.ui.notes.hide();
            this.listenTo(this.dataChannel, 'dataLoaded', this.resetGuests);
            return;
        }

        this.resetGuests();
    },
    resetGuests: function() {
        var guestData = window.guestData;

        var data = guestData.guests;
        var maxGuests = guestData.maxGuests;

        var plusOnes = Math.max(0, maxGuests - data.length);

        for (i = 0; i < plusOnes; i++) {
            var plusOne = {"name":"", "isPlusOne":true};
            data.push(plusOne);
        }
        var guestCollection = new GuestCollection(data);
        this.collection = guestCollection;

        var view = new GuestCollectionView({collection: guestCollection});
        this.ui.holder.html(view.render().el);

        this.ui.notes.children("textarea").val(guestData.note);

        this.ui.loading.hide();
        this.ui.notes.show();
    }
});

module.exports = RsvpView;