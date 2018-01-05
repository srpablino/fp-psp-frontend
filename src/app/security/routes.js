import SecurityView from './layout-view';
import session from '../../common/session';

const security = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      security: 'showManageFamilies'
    },
    controller: {
      showManageFamilies() {
        if ((session.userHasRole('ROLE_ROOT') || session.userHasRole('ROLE_HUB_ADMIN'))) {
          app.showViewOnRoute(new SecurityView(app));
        }

      }
    }
  };

  return routes;
};

export default security;
