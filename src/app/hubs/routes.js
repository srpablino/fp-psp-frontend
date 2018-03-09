import ApplicationsView from './index/layout-view';
import applicationsStorage from './storage';
import ApplicationFormView from './add/view';
import Model from './model';

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
        applicationsStorage.find().then(models => {
          app.showViewOnRoute(
            new ApplicationsView({models, app})
          );
        });
      },
      newApplication() {
        app.showViewOnRoute(new ApplicationFormView({app}));
      },
      editApplication(applicationId) {
        const model = new Model();
        model.set('id', applicationId);
        model.fetch()
          .then(() => {
            app.showViewOnRoute(new ApplicationFormView({model, app}));
          });
      }
    }
  };
  return routes;
};

export default applications;
