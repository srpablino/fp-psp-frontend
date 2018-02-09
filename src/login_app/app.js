import Mn from 'backbone.marionette';
import Bn from 'backbone'
import LoginView from './view';
import Router from './routes'

export default Mn.Application.extend({
  region: '#main',

  onStart() {
    const rootView = new LoginView();
    this.showView(rootView);
    this.Router = new Router({controller: rootView});
     Bn.history.start({ root: window.location.pathname });
  }
});
