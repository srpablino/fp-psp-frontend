import FamiliesView from './view';
import FamiliesStorage from './storage';

const families = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      families: 'showFamilies'
    },
    controller: {
      showFamilies() {
        app.showViewOnRoute(new FamiliesView());
      }
    }
  };
  return routes;
};

export default families;
