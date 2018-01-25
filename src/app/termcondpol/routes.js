import TermCondPolView from './view';
import TermCondPolModel from './model';

const termcondpol = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
        'survey/:id/termcondpol/:type': 'showTermCondPol'
    },
    controller: {

      showTermCondPol(hashSurvey, hashType) {

        const model = new TermCondPolModel();
        const surveyId = parseInt(hashSurvey, 10);
        model
          .fetch({
            data: {
              type: hashType
            }
          })
          .then(() => {
            app.showViewOnRoute(new TermCondPolView({ model, app, surveyId }));
          });
      }
    }
  };
  return routes;
};

export default termcondpol;