import Bn from 'backbone';
import Mn from 'backbone.marionette';
import _isRegExp from 'lodash/fp/isRegExp';
import _isFunction from 'lodash/fp/isFunction';

export default Mn.AppRouter.extend({
  initialize(options) {
    this.before = options.before || function() {};
    this.after = options.after || function() {};
  },
  before() {},
  after() {},
  route(route, name, callback) {
    if (!_isRegExp(route)) {
      route = this._routeToRegExp(route);
    }

    if (_isFunction(name)) {
      callback = name;
      name = '';
    }
    if (!callback) {
      callback = this[name];
    }

    let router = this;

    Bn.history.route(route, function(fragment) {
      var args = router._extractParameters(route, fragment);

      router.before(...arguments);
      callback && callback.apply(router, args);
      router.after(...arguments);

      router.trigger(...[`route:${name}`].concat(args));
      router.trigger('route', name, args);
      Bn.history.trigger('route', router, name, args);
    });
    return this;
  }
});
