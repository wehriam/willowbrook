define(["underscore", "backbone", "viewmaker"], function(_, Backbone, ViewMaker){
  var Views = function(render, is_node) {
    var viewmaker = new ViewMaker(render, is_node);
    this.test = viewmaker.make({}, ["templates/test.html"]);
  }
  return Views;
});

