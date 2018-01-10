import SurveysView from './view';

const surveys = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      surveys: 'showSurveys'
    },
    controller: {
      showSurveys() {
        localStorage.termCond = 0;
        localStorage.priv = 0;
        app.showViewOnRoute(new SurveysView(app));
      }
    }
  };
  return routes;
};

export default surveys;
