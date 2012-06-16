define(['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
  // Node.js filesystem module.
  var fs = null;
  /**
   * Combines two arrays into an object.
   * @param {array} a Array of property names strings.
   * @param {array} b Array of property value strings.
   * @return {object} Object with keys from a and values from b.
   */
  var combine = function(a, b) {
    var response = {};
    while (a.length) {
      response[a.shift()] = b.shift();
    }
    return response;
  };
  /**
   * Fetches a template from the filesystem.
   * @param {string} path Filesystem path of the template.
   * @return {deferred} Deferred that returns a template.
   */
  var fetchNodeTemplate = function(path) {
    var d = $.Deferred();
    var JST = window.JST = window.JST || {};
    // Attempt to get from cache.
    if (JST[path]) {
      return d.resolve(JST[path]);
    }
    // Get from filesystem.
    fs.readFile(requirejs.toUrl(path), 'utf-8', function(err, contents) {
      if (err) {
        console.log(err);
        d.reject(err);
        return;
      }
      JST[path] = _.template(contents);
      d.resolve(JST[path]);
    });
    return d.promise();
  }
  /**
   * Fetches a template via HTTP.
   * @param {string} path Path of the template.
   * @return {deferred} Deferred that returns a template.
   */
  var fetchAJAXTemplate = function(path) {
    var d = $.Deferred();
    var JST = window.JST = window.JST || {};
    // Attempt to get from cache.
    if (JST[path]) {
      return d.resolve(JST[path]);
    }
    // Get via AJAX.
    $.ajax({
      url: path,
      success: function(contents, textStatus, jqXHR) {
        JST[path] = _.template(contents);
        d.resolve(JST[path]);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        d.reject(textStatus, errorThrown);
      },
      dataType: 'text'
    });
    return d.promise();
  };
  /**
   * Returns an object that makes Backbone views.
   * @param {function} render Render function to receive render deferreds.
   * @param {boolean} is_node Indicates whether we are in node.js or not.
   * @return {object} Object that makes Backbone views.
   */
  var ViewMaker = function(render, is_node) {
    if (is_node && !fs) {
      fs = require('fs');
    }
    /**
     * Returns an
     * @param {object} data Object containing values or deferreds.
     * @param {array} templates List of template paths.
     * @return {object} Returns a Backbone view.
     */
    this.make = function(options) {
      var data = options.data;
      var templates = options.templates;
      return Backbone.View.extend({
        initialize: function() {
        },
        render: function() {
          var d = $.Deferred();
          render(d.promise());
          // Deferred to wait for templates.
          var template_deferred = $.Deferred();
          // Deferred to wait for data.
          var data_deferred = $.Deferred();
          // Fetch the templates.
          var template_promises = _.map(
              templates,
              is_node ? fetchNodeTemplate : fetchAJAXTemplate);
          // When the templates are fetched, fire template_deferred
          $.when.apply(null, template_promises).then(
            function() {
              template_deferred.resolve(_.values(arguments));
            },
            function() {
              template_deferred.reject(_.values(arguments));
            }
          );
          // When the data is fetched, fire data_deferred
          $.when.apply(null, _.values(data)).then(
            function() {
              data_deferred.resolve(combine(_.keys(data), _.values(arguments)));
            },
            function() {
              data_deferred.reject(combine(_.keys(data), _.values(arguments)));
            }
          );
          // When we have both data and templates ready, build the content and
          // return the value to the render function.
          $.when(template_deferred, data_deferred).then(
            function(templates, data) {
              var s = _.map(templates, function(t) {return t(data)}).join();
              d.resolve(s);
            },
            function() {
              d.reject();
            }
          );
          return d;
        }
      });
    }
  }
  return ViewMaker;
});
