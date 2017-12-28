import Storage from 'backbone.storage';

var SurveysStorage = Storage.extend({
    
    getSubHeaderItems() {
      return {
        mainItem: {
          name: `List of available surveys`,
          link: `/#surveys`
        }
      };
    }
  });
  
  export default new SurveysStorage();
  