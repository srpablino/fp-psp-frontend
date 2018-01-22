/* eslint camelcase: 0 */
import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import env from '../env';
import session from '../../common/session';
import { getLoadingButton } from '../../common/utils';
import FlashesService from '../../common/flashes/service';

export default Mn.View.extend({
  template: Template,
  regions: {
    container: '#container',
    flashes: '#flashes'
  },
  events: {
    'click #btn-login': 'doLogin',
    'click #link-email': 'entryEmail',
    'click #back-login': 'backLogin',
    'click #btn-recovery': 'sendEmail'

  },

  initialize(options) {
    this.app = options.app;
    session.fetch();

    FlashesService.setup({
      container: this.getRegion('flashes')
    });

  },
  entryEmail(){
    $(".login").hide();
    $(".recovery").show();
  },
  backLogin(){
    $(".login").show();
    $(".recovery").hide();
  },

  doLogin(event) {
    event.preventDefault();

    const loginBtn = this.$el.find('#btn-login');
    const button = getLoadingButton(loginBtn);

    let username = $('#login-username').val();
    let password = $('#login-password').val();

    let url = `${
      env.API_AUTH
    }/token?username=${username}&password=${password}&grant_type=password`;

    let clientid = 'barClientIdPassword';
    let clientsecret = 'secret';
    button.loading();
    $.ajax({
      url,
      type: 'POST',
      dataType: 'json',
      headers: {
        Authorization: `Basic ${btoa(`${clientid}:${clientsecret}`)}`
      },

      success: data => {
        if (data.error) {
          // If there is an error, show the error messages
          $('.alert-error')
            .text(data.error.text)
            .show();
        } else {
          // If not, send them back to the home page
          const { access_token, refresh_token, user } = data;
          session.save({ access_token, refresh_token, user });

          const fragment = session.getLoggedUserHomeRoute();
          window.location.replace(`/#${fragment}`);
        }
      },
      error(xmlHttpRequest, textStatus) {
        if (xmlHttpRequest && xmlHttpRequest.status === 0) {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'danger',
            title: 'No connection to server'
          });
          return;
        }
        if (textStatus === 'Unauthorized') {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'warning',
            title: 'Not authorized'
          });
        } else {
          FlashesService.request('add', {
            type: 'warning',
            title: 'Wrong credentials. Please try again.',
            timeout: 2000
          });
          $('#login-username').val('');
          $('#login-password').val('');
          $('#login-username').focus();
        }
      },
      complete: () => {
        button.reset();
      }
    });
  },

  sendEmail(event) {
    event.preventDefault();
    let self = this;
    const rcoveryBtn = this.$el.find('#btn-recovery');
    const button = getLoadingButton(rcoveryBtn);

    let email = $('#login-email').val();

    let url = `${
      env.API_PUBLIC
    }/password/resetPassword?email=${email}`;

    button.loading();
    $.ajax({
      url,
      type: 'POST',
      success() {
        // if (data.error) {
        //   // If there is an error, show the error messages
        //   $('.alert-error')
        //     .text(data.error.text)
        //     .show();
        // } else {
          // If not, send them back to the home page
          FlashesService.request('add', {
            timeout: 2000,
            type: 'info',
            title: 'Hemos enviado un correo. Favor verifique'
          });

          self.backLogin();
        // }
      },
      error(xmlHttpRequest, textStatus) {
        if (xmlHttpRequest && xmlHttpRequest.status === 0) {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'danger',
            title: 'No connection to server'
          });
          return;
        }
        if (textStatus === 'Unauthorized') {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'warning',
            title: 'Not authorized'
          });
        } else {
          FlashesService.request('add', {
            type: 'warning',
            title: 'Enter your email. Please try again.',
            timeout: 2000
          });

        }
      },
      complete: () => {
        $('#login-email').val('');
        button.reset();
      }
    });
  }
});
