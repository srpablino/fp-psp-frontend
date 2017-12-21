import FamiliesView from './index/layout-view';
import FamilyView from './show/view';
import FamilySnapshotListView from './show/snapshot/list/view';
import FamilySnapshotView from './show/snapshot/view';
import familiesStorage from './storage';
import SnapshotCollection from './show/snapshot/list/collection';

const families = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'families(/)': 'showFamilies',
      'families/:id(/:entity)': 'showFamily',
      'families/:id/snapshots(/:snapshotId)': 'showSnapshotFamily'
    },
    controller: {
      showFamilies() {
        // familiesStorage.findAll().then(collection => {
        //   app.showViewOnRoute(new FamiliesView({ collection }));
        // });

          app.showViewOnRoute(new FamiliesView());

      },
      showFamily(familyId, entity) {
        familiesStorage.find(familyId).then(model => {
          if(entity === 'snapshots'){
            app.showViewOnRoute(
              new FamilySnapshotListView({
                model,
                app,
                entity
              })
            );
          }else{
            app.showViewOnRoute(
              new FamilyView({
                model,
                app,
                entity
              })
            );
          }
        }); 
        
      },
      showSnapshotFamily(familyId, snapshotId) {
        familiesStorage.find(familyId).then(model => {
          app.showViewOnRoute(
            new FamilySnapshotView({
              model,
              app,
              snapshotId
            })
          );
        });
      }
    }
  };
  return routes;
};

export default families;
