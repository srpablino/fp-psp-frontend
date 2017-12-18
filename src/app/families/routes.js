import FamiliesView from './view';
import FamilyView from './show/view';
import FamilySnapshotView from './show/snapshot/view';
import familiesStorage from './storage';

const families = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'families(/)': 'showFamilies',
      'families/:id(/:entity)': 'showFamily'
    },
    controller: {
      showFamilies() {
        app.showViewOnRoute(new FamiliesView({
            app
          })
        );
      },
      showFamily(familyId, entity) {
        familiesStorage.find(familyId)
          .then(model => {
            app.showViewOnRoute(new FamilyView({ 
              app, 
              model,
              entity
            })
          );
        });
      },
      showSnapshotFamily(snapshotId) {
        app.showViewOnRoute(new FamilySnapshotView({
          app,
          snapshotId
        }));
      }
    }
  };
  return routes;
};

export default families;
