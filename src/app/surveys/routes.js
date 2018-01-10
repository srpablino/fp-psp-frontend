import SurveysView from './view';

const surveys = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      surveys: 'showSurveys'
    },
    controller: {
      showSurveys() {
        app.getSession().save({termCond: 0, priv: 0});
        app.showViewOnRoute(new SurveysView(app));
      }
    }
  };
  return routes;
};

export default surveys;
