import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotView from '../../../snapshots/add/view';
import ModalService from '../../../modal/service';
import FlashesService from '../../../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .delete-draft-btn': 'handleDelete',
    'click .edit-draft-btn': 'handleEdit'
  },
  initialize(options) {
    this.app = options.app;
    this.model = options.model;
    this.showList = options.showList;
  },

  serializeData() {
    return {
      snapshotDraft: this.model.attributes
    };
  },

  handleDelete(event) {
    var self = this;
    event.preventDefault();
    ModalService.request('confirm', {
      title: t('draft.messages.delete-confirm-title'),
      text: t('draft.messages.delete-confirm')
    }).then(confirmed => {
      if (!confirmed) {
        return;
      }

      this.model.destroy().then(
        () => {
          self.showList();
          FlashesService.request('add', {
            timeout: 2000,
            type: 'info',
             title: t('draft.messages.delete-done')
          });
    
         
        },

        error => {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'warning',
             title: error.responseJSON.message
          });
        }

      );
    });
  },

  handleEdit(event){
    event.preventDefault();
    
    this.app.getSession().save({termCond: this.model.attributes.term_cond_id, priv: this.model.attributes.priv_pol_id});

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

     Bn.history.navigate(`/snapshot/draft/${this.model.attributes.id}/edit`, { replace: true });
  }

});
