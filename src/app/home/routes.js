import HomeView from './view';
import FamilyCounterModel from '../families/counter/model';

const home = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      '': 'showHome',
      home: 'showHome'
    },
    controller: {
      showHome() {
        // FIXME: Temporal fix, to
        // avoid calling counter when
        // not allowed.
        if (app.getSession().userHasRole('ROLE_SURVEY_USER')) {
          app.showHomeForUser(new HomeView({totalFamilies: null}));
          return;
        }
        const familyModel = new FamilyCounterModel();
        familyModel.fetch().then(data => {
          app.showHomeForUser(new HomeView({totalFamilies: data}));
        });
      }
    }
  };
  return routes;
};

export default home;
