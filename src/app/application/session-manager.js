import Bn from 'backbone';
import session from '../../common/session';
import $ from 'jquery';
import env from '../env';

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
    return $.ajax({
      url: env.API_AUTH + '/revoke-token',
      type: 'GET',
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      },
      success: () => {
        session.save(session.defaults);
      }
    });
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
