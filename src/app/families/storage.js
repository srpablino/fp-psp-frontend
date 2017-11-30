import Storage from 'backbone.storage';
import Model from './model';

var FamiliesStorage = Storage.extend({
  model: Model,
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
  }
});

export default new FamiliesStorage();
