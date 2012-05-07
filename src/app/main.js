var touch = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
if(touch) {
  var view_module = "views/touch-action";
} else {
  var view_module = "views/click-action";
}
require(["jquery", "router", view_module], 
  function($, Router, Views){
    var router = new Router({
      render: function(d){
        d.done(function(s){
          $("#main").html(s);
        });
        d.fail(function(){
          console.log("There has been an error.");
        });
      },
      views: Views
    });
    $(document).ready(function(){
      Backbone.history.start({pushState: false});
    });
  }
);