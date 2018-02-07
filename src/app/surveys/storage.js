import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({

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
            name: `List of available surveys`,
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
