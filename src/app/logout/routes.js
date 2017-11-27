const logout = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      logout: 'doLogout'
    },
    controller: {
      doLogout() {
        app.logout();
      }
    }
  };
  return routes;
};

export default logout;
