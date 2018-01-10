import Storage from 'backbone.storage';

var SnapshotItemStorage = Storage.extend({
    
    getSubHeaderItems(model) {
      return {
        mainItem: {
          name: `Select your priorities`,
          link: `/#survey/${model.survey_id}/snapshot/${model.snapshot_economic_id}`
        }
      };
    }
  });
  
  export default new SnapshotItemStorage();