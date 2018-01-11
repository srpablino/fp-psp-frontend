import UsersView from './view';
import NewUserView from '../users/add/view';
import usersStorage from './storage';

const users = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      'users(/)': 'showUsers',
      'users/new': 'newUser',
    },
    controller: {
      //paginated users
      showUsers() {
        if (app.getSession().userHasRole('ROLE_ROOT')
          || app.getSession().userHasRole('ROLE_HUB_ADMIN')
          || app.getSession().userHasRole('ROLE_APP_ADMIN')
        ) {
          usersStorage.find().then(model => {
            app.showViewOnRoute(new UsersView({ model }));
          });
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
