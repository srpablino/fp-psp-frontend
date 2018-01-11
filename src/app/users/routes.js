import UsersView from './view';
import NewUserView from '../users/add/view';

const users = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      'users(/)': 'showUsers',
      'users/new': 'newUser',
    },
    controller: {
      showUsers() {
        if (app.getSession().userHasRole('ROLE_ROOT')
          || app.getSession().userHasRole('ROLE_HUB_ADMIN')
          || app.getSession().userHasRole('ROLE_APP_ADMIN')
        ) {
          app.showViewOnRoute(new UsersView());
        }
      },
      newUser() {
        app.showViewOnRoute(new NewUserView({app}));
      }
    }
  };

  return routes;
};

export default users;
