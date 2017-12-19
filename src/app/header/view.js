import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _toLower from 'lodash/toLower';
import _startCase from 'lodash/startCase';

export default Mn.View.extend({
  template: Template,
  initialize(options) {
    this.app = options.app;
  },
  // FIXME Temporary function.
  // The full profile user name should
  // be retrieved from the server and not parsed from username.
  getUserProfileName() {
    let username = this.app.getSession().get('user').username;
    if (!username) {
      return 'Anonymous';
    }
    if (username.indexOf('_') > 0) {
      return _startCase(_toLower(username.split('_').join(' ')));
    }
    return _startCase(username);
  },
  serializeData() {
    return {
      mainItem: this.model.get('mainItem'),
      navigationItems: this.model.get('navigationItems'),
      username: this.getUserProfileName()
    };
  }
});
