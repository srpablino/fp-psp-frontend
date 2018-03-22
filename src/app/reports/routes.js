import FamilyOrganizationView from './snapshots/by_organization/view';

const reports = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
        'reports/snapshots/byOrganization(/)': 'showFamiliesByOrgamization'
    },
    controller: {


        showFamiliesByOrgamization() {
            app.showViewOnRoute(new FamilyOrganizationView({app}));
        }
    }
  };
  return routes;
};

export default reports;
