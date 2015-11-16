var App = require('./app');

var options = {
  something: "some value1",
  another: "#some-selector"
};

var myapp = new App(options);

myapp.start();
