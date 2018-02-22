import Mn from 'backbone.marionette';
import Bn from 'backbone';
import Polyglot from 'node-polyglot';
import LoginView from './view';
import Router from './routes';
import es from '../static/i18n/es';
import I18nModel from '../app/i18n/model';

export default Mn.Application.extend({
  region: '#main',

  onStart() {

    let locale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    locale = locale.replace('-', '_');
    this.initializeI18nAndView(locale);
  },

  initializeI18nAndView(locale){
    var self = this;
    new I18nModel({code: locale}).fetch({
      success(phrases){
        self.setLanguage(phrases.toJSON(), locale);
      },
      error(){
        self.setLanguage(es, locale);  
      }
    });

  },

  setLanguage(phrases, locale){
     // i18n
    this.polyglot = new Polyglot({phrases});
    window.polyglot = this.polyglot
    window.t = (string, data) => this.polyglot.t(string, data);
    this.setView(phrases, locale);

  },
  
  setView(phrases, locale){
     // Login and reset view
     let rootView = new LoginView({localeConfiguration: {
       locale,
       messages: phrases
     }});
     this.showView(rootView);
     this.Router = new Router({controller: rootView});
     Bn.history.start({ root: window.location.pathname });
  }
    
  
});
