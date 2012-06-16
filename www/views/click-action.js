define(["views/click"], function(Views){
  Views.test.events = {
      "a":function(){alert(1);}
  };
  return Views;
});