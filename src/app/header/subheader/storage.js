import Storage from 'backbone.storage';
import Model from '../model';

var SubheaderStorage = Storage.extend({
  model: Model,
  getByRolesInSession(headerItems, session) {
    if (session.userIsOrganizationAdmin()) {
      return new Model(headerItems);
    }

    const items = {
      mainItem: headerItems.mainItem,
      navigationItems:
        headerItems.navigationItems &&
        headerItems.navigationItems.filter(
          item => item.link.indexOf('users') < 0
        )
    };
    return new Model(items);
  }
});

export default new SubheaderStorage();
