import FamilyOrganizationView from './families/by_organization/view';

const reports = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
        'reports/families/byOrganization(/)': 'showFamiliesByOrgamization'
    },
    controller: {


        showFamiliesByOrgamization() {
            console.log("aca tengo que mostrar familias por organization");
            app.showViewOnRoute(new FamilyOrganizationView({app}));
        }
    }
  };
  return routes;
};

export default reports;
