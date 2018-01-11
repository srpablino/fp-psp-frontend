import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var UsersStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {
        name: model.get('name'),
        link: `/#users/${model.get('id')}`
      }
    };
  }
});

export default new UsersStorage();
