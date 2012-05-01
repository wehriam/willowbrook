var requirejs = require('requirejs');
requirejs.config({
  baseUrl: "../src",
  nodeRequire: require,
  paths: {
    jquery: "lib/jquery-1.7.2",
    backbone: "lib/backbone",
    underscore: "lib/underscore",
    viewmaker: "lib/viewmaker",
    router: "router"
  }
});
requirejs(["jsdom", "location", "xmlhttprequest", "navigator"], function(
    jsdom, 
    location, 
    xmlhttprequest, 
    _navigator){
  document = jsdom.jsdom()
  window = document.createWindow();
  window.location = location;
  window.location.assign = function(){};
  navigator = _navigator;
  window.XMLHttpRequest = require('xmlhttprequest');
});
requirejs(['backbone', 'router', 'express', 'views/click'], function(
    Backbone, 
    Router, 
    express, 
    ClickViews) {
  var router = new Router({
    render: function(s){console.log("ROUTER " + s)},
    views: ClickViews,
    is_node: true
  });
  Backbone.history.start({pushState: false, hashChange: false});
  var app = express.createServer();
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(app.router);
  app.get('/', function(request, response) {
    console.log("GOT INDEX")
  });
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log("Listening on " + port);
  });

  setTimeout(function(){
    router.navigate("test", {trigger:true});
  }, 250);
  setTimeout(function(){
    router.navigate("", {trigger:true});
  }, 500);
});