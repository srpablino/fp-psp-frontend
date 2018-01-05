import merge from 'lodash/merge';
import BaseRouter from './baserouter';
import organizations from '../organizations/routes';
import surveys from '../surveys/routes';
import snapshots from '../snapshots/routes';
import users from '../users/routes';
import logout from '../logout/routes';
import initAuthorizer from './router-authorizer';
import families from '../families/routes';
import home from '../home/routes';

import faqs from '../faqs/routes';

const initRouter = props => {
  const { app, before, onAccessDenied } = props;

  const { appRoutes, controller } = merge(
    logout(props),
    organizations(props),
    surveys(props),
    snapshots(props),
    users(props),
    families(props),
    home(props),
    faqs(props)
  );
  const authorizer = initAuthorizer({
    onAccessDenied,
    session: app.getSession(),
    appRoutes
  });

  return new BaseRouter({
    appRoutes,
    controller,
    before: route => {
      authorizer.canAccess(route);
      before.apply();
    }
  });
};

export default initRouter;
