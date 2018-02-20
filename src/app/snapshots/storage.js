import Storage from 'backbone.storage';

var SnapshotsStorage = Storage.extend({
    
    getSubHeaderItems(model) {
      return {
        mainItem: {
          name: `${t('survey.survey')}: ${model.survey_name}`,
          link: `#survey/${model.survey_id}/answer`
        }
      };
    }
  });
  
  export default new SnapshotsStorage();