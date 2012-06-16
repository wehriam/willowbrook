define(
  ['jquery'],
  function($) {
    var d = $.Deferred();
    setTimeout(function() {
      d.resolve(2)
    }, 500);
    return {
      test: {
        data: {one: 1, two: d.promise()},
        templates: ['templates/test.html'] 
      },
      test2: {
        data: {},
        templates: ['templates/test2.html'] 
      }
    }
  }
);

