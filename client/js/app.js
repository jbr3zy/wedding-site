var Marionette = require('backbone.marionette')
var RootView = require('./views/root')

var App = Marionette.Application.extend({
  initialize: function(options) {
    this.rootView = new RootView(options);
    this.rootView.render();
  }
});

module.exports = App;