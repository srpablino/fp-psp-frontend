import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({

    getSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: `List of available surveys`,
            link: `/#surveys`
          },
          {
            name: `List of incomplete snapshots`,
            link: `/#surveys/drafts`
          }
        ]
      };
    }
  });

  export default new SurveysStorage();
