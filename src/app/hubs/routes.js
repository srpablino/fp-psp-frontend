import ApplicationsView from './index/layout-view';
import applicationsStorage from './storage';

const applications = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'applications(/)': 'showApplications'
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
      }
    }
  };
  return routes;
};

export default applications;
