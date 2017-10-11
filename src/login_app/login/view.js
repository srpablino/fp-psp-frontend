/**
 *
 * @type Module marionette|Module marionette
 */
import Mn from 'backbone.marionette';
import Template from './template.hbs';

require('parsleyjs');
// TODO Esto funciona mágicamente y
// no se ni como. Investigar mejor
// y documentar
require('parsleyjs/dist/i18n/es');

const ENTER_KEY = 13;

export default Mn.ItemView.extend({
  template: Template,
  events: {
    'click #login-btn': 'onLoginAttempt',
    'keyup #login-password-input': 'onPasswordKeyup',
  },
  onPasswordKeyup(event) {
    const k = event.keyCode || event.which;

    if (k === ENTER_KEY && $('#login-password-input').val() === '') {
      event.preventDefault();
    } else if (k === ENTER_KEY) {
      event.preventDefault();
      this.onLoginAttempt();
      return false;
    }
  },
  onLoginAttempt(event) {
    let self = this,
      userData;
    if (event) {
      event.preventDefault();
    }
    const valid = this.$('#login-form')
      .parsley()
      .validate();

    if (valid) {
      userData = {
        email: this.$('#login-mail-input').val(),
        password: this.$('#login-password-input').val(),
      };

      this.$('#login-btn').loading(true);

      window.App.session.login(userData, {
        success(res) {
          window.App.showMainContent();
        },
        error(jqXHR, textStatus) {
          // no hacemos nada, el errorHandler
          // se va a encargar de hacer todo
        },
        complete() {
          self.$('#login-btn').loading(false);
        },
      });
    }
  },
});
