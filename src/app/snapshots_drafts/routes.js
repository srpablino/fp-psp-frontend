import Bn from 'backbone';
import SnapshotDraftModel from './model';
import SnapshotView from '../snapshots/add/view';

const snapshotsDraft = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'snapshot/draft/:id/edit': 'showSnapshotDraft'
    },
    controller: {
      showSnapshotDraft(hash) {
        
        const draftId = parseInt(hash, 10);

        let model =  new SnapshotDraftModel();
        model.set('id', draftId);

        model.fetch().then(() => {
         
          const newSnapshotView = new SnapshotView({
            organizationId: app.getSession().get('user').organization
              ? app.getSession().get('user').organization.id
              : null,
            surveyId: model.attributes.survey_id,
            handleCancel() {
              Bn.history.navigate(`/surveys`, true);
            },
            app,
            stateDraft: model.attributes.state_draft,
            snapshotDraftId: model.attributes.id
          });
  
          app.showViewOnRoute(newSnapshotView);
        });

      }
    }
  };
  return routes;
};

export default snapshotsDraft; 