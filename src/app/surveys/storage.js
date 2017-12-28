import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({
    
    getSubHeaderItems() {
      return {
        mainItem: {
          name: `List of Surveys`,
          link: `/#surveys`
        }
      };
    }
  });
  
  export default new SurveysStorage();
  