import Bn from 'backbone';
import session from '../../common/session';

const SessionManager = Bn.Model.extend({
  initialize() {
    session.fetch();
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
  }
});

export default new SessionManager();
