import SecurityView from './layout-view';

const security = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      'manage-families': 'showManageFamilies'
    },
    controller: {
      showManageFamilies() {
        if ((app.getSession().userHasRole('ROLE_ROOT') || app.getSession().userHasRole('ROLE_HUB_ADMIN'))) {
          app.showViewOnRoute(new SecurityView({app}));
        }

      }
    }
  };

  return routes;
};

export default security;
