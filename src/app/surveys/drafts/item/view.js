import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotView from '../../../snapshots/add/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .delete-draft-btn': 'handleDelete',
    'click .edit-draft-btn': 'handleEdit'
  },
  initialize(options) {
    this.app = options.app;
    this.model = options.model;
  },


  serializeData() {
    return {
      snapshotDraft: this.model.attributes
    };
  },

  handleDelete(event) {
    event.preventDefault();
  },

  handleEdit(event){
    event.preventDefault();
    
    const newSnapshotView = new SnapshotView({
      organizationId: this.app.getSession().get('user').organization
        ? this.app.getSession().get('user').organization.id
        : null,
      surveyId: this.model.attributes.survey_id,
      handleCancel() {
        Bn.history.navigate(`/surveys`, true);
      },
      app: this.app,
      stateDraft: this.model.attributes.state_draft,
      snapshotDraftId: this.model.attributes.id
    });

    this.app.showViewOnRoute(newSnapshotView);

    // Bn.history.navigate(`/snapshot/draft/${this.model.attributes.id}/edit`, true);
  }

});
