import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var OrganizationsStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {
        name: model.get('name'),
        link: `/#organizations/${model.get('id')}`
      },
      navigationItems: [
        {
          name: 'Families',
          link: `/#organizations/${model.get('id')}/families`
        },
        {
          name: 'Users',
          link: `/#organizations/${model.get('id')}/users`
        },
        {
          name: 'Indicators',
          link: `/#organizations/${model.get('id')}/indicators`
        }
      ]
    };
  },
  getMainSubHeaderItems() {
    return {
      navigationItems: [
        {
          name: 'Hubs',
          link: `/#collaborators/hubs`
        },
        {
          name: 'Partnes',
          link: `/#collaborators/partnes`
        }
      ]
    };
  }
});

export default new OrganizationsStorage();
