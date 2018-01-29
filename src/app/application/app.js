import Bb from 'backbone';
import Mn from 'backbone.marionette';
import nprogress from 'nprogress';
import initRouter from './router';
import LayoutView from './layout-view';
import sessionMgr from './session-manager';
import FlashesService from '../flashes/service';
import ModalService from '../modal/service';
import errorHandler from './error-handler';

export default Mn.Application.extend({
  region: '#main',

  initialize() {
    this.sessionMgr = sessionMgr;
    this.layoutView = new LayoutView({app: this});
    this.router = {};
  },

  onStart() {
    if (!this.sessionMgr.isAuthenticated()) {
      this.toLoginPage();
      return;
    }

    this.setupApp();

    this.router = initRouter({
      app: this,
      before: this.beforeRoute.bind(this),
      onAccessDenied: () => {
        errorHandler.redirectToErrorPage(
          'denied',
          new Error('Access denied error')
        );
      }
    });

    Bb.history.start();
    this.showView(this.layoutView);
  },
  setupApp() {
    nprogress.configure({
      showSpinner: false
    });

    errorHandler.setup({
      sessionMgr
    });

    ModalService.setup({
      container: this.layoutView.getRegion('overlay')
    });

    FlashesService.setup({
      container: this.layoutView.getRegion('flashes')
    });
  },
  getSession() {
    return this.sessionMgr.getSession();
  },
  showViewOnRoute(view) {
    this.layoutView.showView(view);
  },
  showHomeForUser(dashboardView) {
    const homeRoute = this.getSession().getLoggedUserHomeRoute();
    if (homeRoute.indexOf('organizations') >= 0) {
      Bb.history.navigate(homeRoute, {trigger: true});
      return;
    }
    this.showViewOnRoute(dashboardView);
  },
  updateSubHeader(headerItems) {
    this.layoutView.updateSubHeader(headerItems);
  },
  beforeRoute() {
    this.emptySubHeader();
  },
  emptySubHeader() {
    this.layoutView.updateSubHeader(null);
  },
  logout() {
    this.sessionMgr.logout().then(() => {
      this.toLoginPage();
    });
  },
  toLoginPage() {
    this.sessionMgr.rememberRoute();

    // Redirects to the login page.
    // FIXME: Ideally this should be only '/login'
    window.location.replace('/login.html');
  }
});
