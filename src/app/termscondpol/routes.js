import TermCondPolView from './view';

const termCondPol = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
        'termcondpol/:type': 'showTermCondPol'
    },
    controller: {
        showTermCondPol() {
            app.showViewOnRoute(new TermCondPolView({app}));
      }
    }
  };
  return routes;
};

export default termCondPol;