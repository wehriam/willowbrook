var requirejs = require('requirejs');
requirejs.config({
  baseUrl: '../src',
  nodeRequire: require,
  paths: {
    jquery: 'lib/jquery-1.7.2',
    backbone: 'lib/backbone',
    underscore: 'lib/underscore',
    viewmaker: 'lib/viewmaker',
    router: 'router'
  }
});
require('./backbonerouter.js');
requirejs(['jsdom', 'backbone', 'router', 'express', 'views/click', 'path'], function(
    jsdom,
    Backbone, 
    Router, 
    express, 
    ClickViews,
    path) {
  var router = new Router({
    render: function(d) {},
    views: ClickViews,
    is_node: true
  });
  var app = express.createServer();
  app.use(express.logger());
  app.use(express.bodyParser());
  app.get('/', function(req, res) {
    res.sendfile(path.normalize(__dirname + '/../src/index.html'));
  });
  app.get('*', function(req, res) {
    res.sendfile(path.normalize(__dirname + '/../src' + req.url), function(err) {
      if (err) {
        var fragment = req.url.slice(1);
        var d = router.sendRoute(fragment);
        if(d) {
          d.done(function(s) {
            jsdom.env(path.normalize(__dirname + '/../src/index.html'), function(errors, w) {
              w.document.getElementById("main").innerHTML = s;
              res.send(w.document.innerHTML);
              w.close();
            });
          });
          d.fail(function() {
            res.send(500);
          });
        } else {
          res.send(404);
        } 
      }
    });
  });
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on ' + port);
  });
});
