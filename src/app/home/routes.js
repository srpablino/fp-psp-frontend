import HomeView from './view';

const home = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      home: 'showHome'
    },
    controller: {
      showHome() {
        app.showViewOnRoute(new HomeView());
      }
    }
  };
  return routes;
};

export default home;
