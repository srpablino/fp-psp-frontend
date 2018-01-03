import SecurityView from './layout-view';

const security = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      security: 'showFamilies'
    },
    controller: {
      showFamilies() {
        app.showViewOnRoute(new SecurityView(app));
      }
    }
  };

  return routes;
};

export default security;
