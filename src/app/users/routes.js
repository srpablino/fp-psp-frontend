import UsersView from './view';
import NewUserView from '../users/add/view';
import usersStorage from './storage';

const users = props => {
  const {app} = props;

  const routes = {
    appRoutes: {
      'users(/)': 'showUsers',
      'users/new': 'newUser',
    },
    controller: {
      showUsers() {
        usersStorage.find().then(model => {
          app.showViewOnRoute(new UsersView({model, app}));
        });
      },
      newUser() {
        app.showViewOnRoute(new NewUserView({app}));
      }
    }
  };

  return routes;
};

export default users;
