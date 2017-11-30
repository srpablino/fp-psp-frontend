import View from './view';

const dashboard = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      '': 'showDashboard',
      home: 'showDashboard'
    },
    controller: {
      showDashboard() {
        app.showHomeForUser(new View({}));
      }
    }
  };
  return routes;
};

export default dashboard;
