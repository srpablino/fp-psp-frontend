import ApplicationsView from './index/layout-view';
import applicationsStorage from './storage';
import NewApplicationView from './add/view';

const applications = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'applications(/)': 'showApplications',
      'applications/new': 'newApplication'
    },
    controller: {
      showApplications() {
        applicationsStorage.find().then(model => {
          app.showViewOnRoute(
            new ApplicationsView({
              model,
              app
            })
          );
        });
      },
      newApplication() {
        app.showViewOnRoute(new NewApplicationView({app}));
      }
    }
  };
  return routes;
};

export default applications;
