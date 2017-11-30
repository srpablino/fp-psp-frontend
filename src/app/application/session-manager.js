import Bn from 'backbone';
import session from '../../common/session';
import $ from 'jquery';

const SessionManager = Bn.Model.extend({
  initialize() {
    session.fetch();
  },
  configure({ router }) {
    this.router = router;
    this.setupAjax();
  },
  getSession() {
    return session;
  },
  isAuthenticated() {
    return session.isAuthenticated();
  },
  getAccessToken() {
    return session.get('access_token');
  },
  logout() {
    session.save(session.defaults);
    return this;
  },
  /**
   * Stores where the user was,
   * before a redirection to login.
   */
  rememberRoute() {
    var returnFragment =
      Bn.history.fragment === 'logout' ? 'home' : Bn.history.fragment;
    session.save({ access_token: null, returnFragment: returnFragment });
    return this;
  },
  redirectToDeniedPage(error) {
    window.location.replace('/denied.html');
    if (error) {
      throw error;
    }
  },
  toLoginPage() {
    this.rememberRoute();

    // Redirects to the login page.
    // FIXME: Ideally this should be only '/login'
    window.location.replace('/login/index.html');
  },

  redirectToLoginAfterError() {
    // TODO Show a friendly message to the user
    this.toLoginPage();
  },
  setupAjax() {
    const accessToken = this.getAccessToken();
    $.ajaxSetup({
      beforeSend: xhr => {
        if (accessToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        }
      },
      statusCode: {
        401: () => {
          this.redirectToLoginAfterError();
        },
        403: () => {
          this.redirectToDeniedPage();
        }
      }
    });
  }
});

export default new SessionManager();
