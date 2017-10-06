import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotCollection from './collection';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #new-survey': 'newSurvey'
  },

  initialize(options) {
    const { handleNewSurvey } = options;
    this.collection = new SnapshotCollection();
    this.collection.on('sync', this.render);
    this.collection.fetch({ data: { survey_id: 123 } });
    this.props = {};
    this.props.handleNewSurvey = handleNewSurvey;
  },

  serializeData() {
    return {
      snapshots: this.collection.models
    };
  },
  newSurvey() {
    this.props.handleNewSurvey();
  }
});
