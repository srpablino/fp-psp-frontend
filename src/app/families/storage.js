import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var FamiliesStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {
        name: `Familia ${model.get('person').lastName}`,
        link: `/#families/${model.get('id')}`
      },
      navigationItems: [
        {
          name: 'Interventions',
          link: `/#families/${model.get('id')}/interventions`
        },
        {
          name: 'Snapshots',
          link: `/#families/${model.get('id')}/snapshots`
        }
      ]
    };
  }
});

export default new FamiliesStorage();
