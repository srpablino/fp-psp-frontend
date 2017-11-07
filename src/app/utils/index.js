const SPINNER_TPL = '<i class="fa fa-circle-o-notch fa-spin"></i>';

export function getLoadingButton(elem, text) {
  const previous = window.$(elem).html();
  return {
    loading: () => {
      window.$(elem).attr('data-loading-text', `${SPINNER_TPL}${text}`);
      window.$(elem).button('loading');
    },
    reset: () => {
      window
        .$(elem)
        .children('i')
        .remove();
      window.$(elem).removeAttr('data-loading-text');
      window.$(elem).button('reset');
    }
  };
}

export default {
  getLoadingButton
};
