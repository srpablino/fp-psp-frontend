import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotCollection from './collection';
import SnapshotItem from './item/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #new-survey': 'newSurvey'
  },
  initialize(options) {
    const { handleNewSurvey, surveyModel } = options;
    this.props = {};
    this.props.handleNewSurvey = handleNewSurvey;
    this.props.surveyModel = surveyModel;

    this.collection = new SnapshotCollection();
    this.collection.on('sync', this.render);
    this.collection.fetch({
      data: { survey_id: this.props.surveyModel.get('id') }
    });
  },
  onRender() {
    const list = this.$el.find('#snapshots-list');
    list.empty();
    this.collection.each(model => {
      const item = new SnapshotItem({ model });
      list.append(item.render().el);
    });
  },
  serializeData() {
    return {
      surveyTitle: this.props.surveyModel.get('title')
    };
  },
  newSurvey() {
    const surveyId = this.$el.find('#survey-id').val();
    this.props.handleNewSurvey(surveyId);
  }
});
