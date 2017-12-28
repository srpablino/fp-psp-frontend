import HomeView from './view';
import FamilyModel from '../families/model'

const home = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      '': 'showHome',
      home: 'showHome',
      'home': 'showHome'
    },
    controller: {
      showHome() {
        const familyModel = new FamilyModel();
        familyModel.urlRoot = familyModel.urlRoot + '/counter';
        familyModel.fetch().then(data => {
          app.showHomeForUser(new HomeView({totalFamilies: data}));
        })        
      }
    }
  };
  return routes;
};

export default home;
