require('./backbonerouter.js');
require('./elasticsearchproxy.js');
var requirejs = require('requirejs');
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
    res.sendfile(path.normalize(__dirname + '/../www/index.html'));
  });


  var httpProxy = require('http-proxy');
  var proxy = new httpProxy.RoutingProxy();
  app.get('/elasticsearch', function(req, res) {
    console.log(req.url);
    proxy.proxyRequest(req, res, {
        host: 'localhost',
        port: 9200
    });
  });

  app.get('*', function(req, res) {
    console.log("something");
    res.sendfile(path.normalize(__dirname + '/../www' + req.url), function(err) {
      if (err) {
        var d = router.sendRoute(req.url);
        if(d) {
          d.done(function(s) {
            jsdom.env(path.normalize(__dirname + '/../www/index.html'), function(errors, w) {
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
  app.listen(port);


//  var httpProxy = require('http-proxy');
//  var proxy = httpProxy.createServer({  
//    router: {
//      '127.0.0.1/elasticsearch/': '127.0.0.1:9200',
//      '127.0.0.1/': 'localhost:' + (port + 1)
//    }
//  });
//  proxy.listen(port, function(){
//    console.log('Listening on ' + port);
//  });
});
