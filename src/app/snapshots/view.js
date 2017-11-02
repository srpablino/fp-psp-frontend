import Mn from 'backbone.marionette';
import Template from './template.hbs';
import NewSurveyView from './add/view';
import SnapshotsView from './list/view';
import SurveyModel from '../surveys/add/model';

export default Mn.View.extend({
  template: Template,

  regions: {
    snapshotsContent: '#snapshots-content'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.surveyModel = new SurveyModel({ id: this.props.surveyId });
    this.surveyModel.fetch();
  },

  onRender() {
    this.showSnapshots();
  },

  newSurvey() {
    const newSurveyView = new NewSurveyView({
      surveyId: this.surveyModel.get('id'),
      handleCancel: this.render.bind(this)
    });

    this.getRegion('snapshotsContent').show(newSurveyView);
  },

  showSnapshots() {
    const snapshotsView = new SnapshotsView({
      surveyModel: this.surveyModel,
      handleNewSurvey: this.newSurvey.bind(this)
    });
    this.getRegion('snapshotsContent').show(snapshotsView);
  }
});
