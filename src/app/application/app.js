import Bb from 'backbone';
import Mn from 'backbone.marionette';
import initRouter from './router';
import LayoutView from './layout-view';
import sessionMgr from './session-manager';

export default Mn.Application.extend({
  region: '#main',

  initialize() {
    this.sessionMgr = sessionMgr;
    this.layoutView = new LayoutView({ app: this });
  },

  onStart() {
    if (!this.sessionMgr.isAuthenticated()) {
      this.sessionMgr.toLoginPage();
      return;
    }

    this.router = initRouter({
      app: this,
      before: this.beforeRoute.bind(this),
      onAccessDenied: () => {
        this.sessionMgr.redirectToDeniedPage(new Error('Access denied error'));
      }
    });

    this.sessionMgr.configure({
      router: this.router
    });
    Bb.history.start();
    this.showView(this.layoutView);
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
      Bb.history.navigate(homeRoute, { trigger: true });
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
    this.sessionMgr.logout().toLoginPage();
  }
});
