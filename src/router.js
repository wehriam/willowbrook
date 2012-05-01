 define(["backbone"], function(Backbone){
  var Router = Backbone.Router.extend({
    initialize: function(options){
      _options = {is_node: false};
      _.extend(_options, options);
      this.views = new _options.views(_options.render, _options.is_node);
    },
    routes: {
      "": "index",
      "test": "test"
    },
    index: function(){
      console.log("BB INDEX");
    },
    test: function(){
      new this.views.test();
    }
  });
  return Router;
});