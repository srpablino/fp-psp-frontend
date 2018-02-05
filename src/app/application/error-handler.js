import $ from 'jquery';
import nprogress from 'nprogress';
import FlashesService from '../flashes/service';

class ErrorHandler {
  setup(options) {
    this.sessionMgr = options.sessionMgr;
    this.setupAjax();
  }
  setupAjax() {
    $.ajaxSetup({
      beforeSend: xhr => {
        const accessToken = this.sessionMgr.getAccessToken();
        if (accessToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        }
      },
      statusCode: {
        0: () => {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'danger',
            title: 'No connection to server'
          });
        },
        401: () => {
          this.redirectToLoginAfterError();
        },
        403: () => {
          this.redirectToErrorPage('denied');
        },
        404: () => {
          this.redirectToErrorPage('notfound');
        },
        500: error => {
          if (error.responseJSON && error.responseJSON.errorId) {
            this._redirectToErrorPage(
              `error.html?id=${error.responseJSON.errorId}`
            );
          } else {
            this.redirectToErrorPage('error');
          }
        }
      }
    });

    $(document).on({
      ajaxStart: () => {
        nprogress.start();
      },
      ajaxComplete: () => {
        nprogress.done();
      }
    });
  }
  redirectToErrorPage(page, error) {
    window.location.replace(`/${page}.html`);
    if (error) {
      throw error;
    }
  }
  _redirectToErrorPage(page) {
    window.location.replace(`/${page}`);
  }
  redirectToLoginAfterError() {
    // TODO Show a friendly message to the user
    window.location.replace('/login.html');
  }
}

export default new ErrorHandler();
