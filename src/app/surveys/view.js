import Mn from 'backbone.marionette';
import Template from './template.hbs';
import NewSurveyView from './definitions/view';
import SnapshotsView from './snapshots/view';

export default Mn.View.extend({
  template: Template,

  regions: {
    surveysContent: '#surveys-content'
  },

  initialize() {},

  onRender() {
    this.showSnapshots();
  },

  newSurvey(event) {
    const newSurveyView = new NewSurveyView({
      surveyId: 123,
      handleCancel: this.showSnapshots.bind(this)
    });

    this.getRegion('surveysContent').show(newSurveyView);
  },

  showSnapshots(tableId = null) {
    const snapshotsView = new SnapshotsView({
      handleNewSurvey: this.newSurvey.bind(this),
      tableId: tableId,
      handleSurveySelectChange: this.showSnapshots.bind(this)
    });
    this.getRegion('surveysContent').show(snapshotsView);
  }
});
