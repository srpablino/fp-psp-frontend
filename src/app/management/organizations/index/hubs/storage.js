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
        link: `/#management/organizations/${model.get('id')}`
      },
      navigationItems: [
        {
          name: t('subheader.families'),
          link: `/#management/organizations/${model.get('id')}/families`
        },
        {
          name: t('subheader.users'),
          link: `/#management/organizations/${model.get('id')}/users`
        },
        {
          name: t('subheader.indicators'),
          link: `/#management/organizations/${model.get('id')}/indicators`
        }
      ]
    };
  },
  getMainSubHeaderItems() {
    return {
      navigationItems: [
        {
          name: t('subheader.hubs'),
          link: `/#collaborators/hubs`
        }
      ]
    };
  }
});

export default new OrganizationsStorage();
