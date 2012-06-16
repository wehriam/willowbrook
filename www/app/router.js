define(['backbone', 'viewmaker'], function(Backbone, ViewMaker) {
  var Router = Backbone.Router.extend({
    initialize: function(options) {
      _options = {is_node: false};
      _.extend(_options, options);
      var views = _options.views;
      var render = _options.render;
      var is_node = _options.is_node;
      var viewmaker = new ViewMaker(render, is_node);
      for (var i in views) {
        var View = viewmaker.make(views[i]);
        this.addRoute(i, View);
      }
    },
    addRoute: function(i, View) {
      this.route(i, i, function(){
        var view = new View();
        return view.render();
      });
    },
    routes: {
      '': 'index'
    },
    index: function() {
      console.log('BB INDEX');
    }
  });
  return Router;
});
