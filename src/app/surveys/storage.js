import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({

    getSubHeaderItems() {
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
