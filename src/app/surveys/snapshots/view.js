import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotCollection from './collection';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #new-survey': 'newSurvey',
    'change #table-id': 'onSurveySelectChange'
  },

  initialize(options) {
    const { handleNewSurvey, tableId, handleSurveySelectChange } = options;
    this.props = {};
    this.props.handleNewSurvey = handleNewSurvey;
    this.props.tableId = tableId;
    this.props.handleSurveySelectChange = handleSurveySelectChange;

    this.collection = new SnapshotCollection();
    this.collection.on('sync', this.render);
    this.collection.fetch({ data: { table_id: tableId, survey_id: 123 } });
  },

  serializeData() {
    return {
      snapshots: this.collection.models
    };
  },
  newSurvey() {
    this.props.handleNewSurvey();
  },
  onSurveySelectChange() {
    const tableId = this.$el.find('#table-id').val();
    this.props.handleSurveySelectChange(tableId);
  }
});
