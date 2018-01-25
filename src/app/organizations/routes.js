import OrganizationsView from './index/layout-view';
import OrganizationView from './show/view';
import NewOrganizationView from './add/view';
import organizationsStorage from './storage';
import OrganizationDashboard from './dashboard/model';

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
            app.showViewOnRoute(
              new OrganizationsView({
                model,
                app
              })
            );
          });
      },
      showOrganization(organizationId, entity) {
        // show the organization dashboard
        const model = new OrganizationDashboard();
        model
          .fetch({
            data: {
              organizationId
            }
          })
          .then(() => {
            app.showViewOnRoute(
              new OrganizationView({
                model,
                app,
                entity,
                organizationId
              })
            );
          });
      },
      newOrganization() {
        app.showViewOnRoute(new NewOrganizationView({app}));
      }
    }
  };
  return routes;
};

export default organizations;
