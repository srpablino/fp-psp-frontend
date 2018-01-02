import HomeView from './view';
import ApplicationModel from '../application/model';

const home = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      '': 'showHome',
      home: 'showHome'
    },
    controller: {
      showHome() {
        if (app.getSession().userHasRole('ROLE_SURVEY_USER')) {
          app.showHomeForUser(new HomeView());
        }else{
          const applicationModel = new ApplicationModel();
          applicationModel.fetch().then(data => {
            app.showHomeForUser(new HomeView({model: applicationModel}));
          });
        }
      }
    }
  };
  return routes;
};

export default home;
