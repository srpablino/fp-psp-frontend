import Bn from 'backbone';
import SnapshotTmpModel from './model';
import SnapshotView from '../snapshots/add/view';

const snapshotsTmp = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'snapshots': 'showSnapshotTmp'
    },
    controller: {
      showSnapshotTmp() {

        const model =  new SnapshotTmpModel();
        model.fetch({
          data: {
            snapshot_draft_id: 1
          }
        }).then(() => {
         
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
            snapshotTmpId: model.attributes.id
          });
  
          app.showViewOnRoute(newSnapshotView);
        });

      }
    }
  };
  return routes;
};

export default snapshotsTmp; 