import SurveysView from './view';
import NewSurvey from './add/view';
import Drafts from './drafts/layout-view';

const surveys = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      surveys: 'showSurveys',
      'surveys/new': 'newSurvey',
      'surveys/drafts': 'drafts',
    },
    controller: {
      showSurveys() {
        app.getSession().save({termCond: 0, priv: 0});
        app.getSession().save({reAnswer: false, formData: null});
        app.showViewOnRoute(new SurveysView({app}));
      },
      newSurvey() {
        app.showViewOnRoute(new NewSurvey({app}));
      },
      drafts() {
        app.showViewOnRoute(new Drafts({app}));
      }
    }
  };
  return routes;
};

export default surveys;
