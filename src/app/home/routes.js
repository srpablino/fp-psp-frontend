import HomeView from './view';

const home = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      '': 'showHome',
      home: 'showHome'
    },
    controller: {
      showHome() {
        app.showHomeForUser(new HomeView({}));
      }
    }
  };
  return routes;
};

export default home;
