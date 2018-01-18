import SurveysView from './view';
import NewSurvey from './add/view';

const surveys = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      surveys: 'showSurveys',
      'surveys/new': 'newSurvey',
    },
    controller: {
      showSurveys() {
        app.getSession().save({termCond: 0, priv: 0});
        app.showViewOnRoute(new SurveysView(app));
      },
      newSurvey() {
        app.showViewOnRoute(new NewSurvey(app));
      }
    }
  };
  return routes;
};

export default surveys;
