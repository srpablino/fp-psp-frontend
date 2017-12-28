import HomeView from './view';
import FamilyCounterModel from '../families/counter/model'

const home = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      '': 'showHome',
      home: 'showHome'
    },
    controller: {
      showHome() {
        const familyModel = new FamilyCounterModel();
        familyModel.fetch().then(data => {
          app.showHomeForUser(new HomeView({totalFamilies: data}));
        })
      }
    }
  };
  return routes;
};

export default home;
