import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({

    getSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: t(`subheader.surveys.list-surveys`),
            link: `/#surveys`
          }
        ]
      };
    },
    getUserSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: t(`subheader.surveys.list-surveys`),
            link: `/#surveys`
          },
          {
            name: t(`subheader.surveys.list-drafts`),
            link: `/#surveys/drafts`
          }
        ]
      };
    }
  });

  export default new SurveysStorage();
