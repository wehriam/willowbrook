var requirejs = require('requirejs');
requirejs(['jsdom', 'location', 'xmlhttprequest', 'navigator'], function(
    jsdom, 
    location, 
    xmlhttprequest, 
    _navigator,
    Router) {
  document = jsdom.jsdom();
  window = document.createWindow();
  window.location = location;
  window.location.assign = function() {};
  navigator = _navigator;
  window.XMLHttpRequest = require('xmlhttprequest');
});
requirejs(['router'], function(Router){
  Router.prototype.routes = [];
  Router.prototype._route = Router.prototype.route;
  Router.prototype.route = function(route, name, callback) {
    Router.prototype._route(route, name, callback);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (!callback) callback = this[name];
    this.routes.push([route, _.bind(function(fragment) {
      var args = this._extractParameters(route, fragment);
      if(callback) {
        return callback.apply(this, args);
      }
    }, this)]);
  }
  Router.prototype.sendRoute = function(fragment) {
    for(var i in this.routes){
      if (this.routes[i][0].test(fragment)){
        return this.routes[i][1](fragment);
      }
    }
    return null;
  }
});