import SurveysView from './view';
import NewSurvey from './add/view';
import Drafts from './drafts/layout-view';
import surveyStorage from './storage';

const surveys = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      surveys: 'showSurveys',
      'surveys/new': 'newSurvey',
      'surveys/drafts': 'drafts',
      'surveys/:id/edit': 'editSurvey'
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
      },
      editSurvey(surveyId) {
        surveyStorage.find(surveyId).then(model => {
          app.showViewOnRoute(new NewSurvey({
            model,
             app
           }));
        });
      },
    }
  };
  return routes;
};

export default surveys;
