import Storage from 'backbone.storage';
import Collection from './list/collection';
import Model from './add/model';

var SurveysStorage = Storage.extend({
  model: Model,
  collection: Collection,
    getSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: `Available Surveys`,
            link: `/#surveys`
          }
        ]
      };
    },
    getUserSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: `Available Surveys`,
            link: `/#surveys`
          },
          {
            name: `Drafts`,
            link: `/#surveys/drafts`
          }
        ]
      };
    }
  });

  export default new SurveysStorage();
