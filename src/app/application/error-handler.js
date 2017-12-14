import $ from 'jquery';
import FlashesService from '../flashes/service';
import nprogress from 'nprogress';

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
            type: 'danger',
            title: 'No connection to server'
          });
        },
        401: () => {
          this.redirectToLoginAfterError();
        },
        403: error => {
          this.redirectToErrorPage('denied');
        },
        404: error => {
          this.redirectToErrorPage('notfound');
        },
        500: error => {
          if (error.responseJSON && error.responseJSON.errorId) {
            console.log(error.responseJSON);
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
    window.location.replace('/login/indexs.html');
  }
}

export default new ErrorHandler();
