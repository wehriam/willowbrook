define(["jquery", "backbone", "underscore"], function($, Backbone, _){
  var fs = null;
  var fetchNodeTemplate = function(path){
    var def = new $.Deferred();
    fs.readFile(path, 'utf-8', function (err, data) {
      console.log(requirejs);
      if (err) {
        console.log(err);
        def.reject(err);
        return;
      }
      console.log(data);
      def.resolve(data);
    });
    this.push(def.promise());
  }
  var fetchAJAXTemplate = function(path) {
    var JST = window.JST = window.JST || {};
    var def = new $.Deferred();
    if (JST[path]) {
      return def.resolve(JST[path]);
    }
    $.ajax({
      url: path,
      success: function(contents, textStatus, jqXHR) {
        JST[path] = _.template(contents);
        def.resolve(JST[path]);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        def.reject(textStatus, errorThrown);
      },
      dataType: "text"
    });
    this.push(def.promise());
  };
  var ViewMaker = function(render, is_node) {
    if(is_node && !fs) {
      fs = require("fs");
    }
    this.render = render;
    this.make = function(data, templates){
      var viewmaker = this;
      return Backbone.View.extend({
        initialize: function(){
          this.render();
        },
        render: function(){
          var template_promises = [];
          if(is_node) {
            fetchNodeTemplate.apply(template_promises, templates);
          } else {
            fetchAJAXTemplate.apply(template_promises, templates);
          }
          $.when.apply(null, template_promises).then(
            function(){
              console.log("Promises done");
            });
          viewmaker.render("++ VIEWMAKER");
        }
      });      
    }
  }
  return ViewMaker;
});