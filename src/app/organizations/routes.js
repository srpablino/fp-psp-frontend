import OrganizationsView from './index/layout-view';
import OrganizationView from './show/view';
import NewOrganizationView from './add/view';
import organizationsStorage from './storage';
import FamilyCounterModel from '../families/counter/model'

const organizations = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'organizations(/)': 'showOrganizations',
      'organizations/new': 'newOrganization',
      'organizations/:id(/:entity)': 'showOrganization'
    },
    controller: {
      // paginated organizations
      showOrganizations() {
        organizationsStorage.find().then(model => {
          app.showViewOnRoute(new OrganizationsView({ model }));
        });
      },
      showOrganization(organizationId, entity) {
        if(entity == null){
          const familyModel = new FamilyCounterModel();
          familyModel.fetch().then(data => {
            const totalFamilies = data;
            organizationsStorage.find(organizationId).then(model => {
              app.showViewOnRoute(
                new OrganizationView({
                  model,
                  app,
                  entity,
                  organizationId,
                  totalFamilies
                })
              );
            });
          });
        }else{
          organizationsStorage.find(organizationId).then(model => {
            app.showViewOnRoute(
              new OrganizationView({
                model,
                app,
                entity,
                organizationId
              })
            );
          });
        }
      },
      newOrganization() {
        app.showViewOnRoute(new NewOrganizationView());
      }
    }
  };
  return routes;
};

export default organizations;
