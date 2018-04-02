import ApplicationsView from './index/layout-view';
import applicationsStorage from './storage';
import ApplicationFormView from './add/view';

const applications = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'applications(/)': 'showApplications',
      'applications/new': 'newApplication',
      'applications/edit/:id': 'editApplication',
    },
    controller: {
      showApplications() {
        app.showViewOnRoute(new ApplicationsView({app}));
      },
      newApplication() {
        app.showViewOnRoute(new ApplicationFormView({app}));
      },
      editApplication(applicationId) {
        applicationsStorage.find(applicationId).then(model => {
          app.showViewOnRoute(new ApplicationFormView({model, app}));
        });

      }
    }
  };
  return routes;
};

export default applications;
