import $ from 'jquery';

const SPINNER_OVERLAY_BTN =
  '<div class="loading-overlay-btn"><img src="/static/images/xsmall-spinner.gif"></div>';

const SPINNER_OVERLAY_SECTION =
  '<div class="loading-overlay-section"><img src="/static/images/small-spinner.gif"></div>';

export function getLoadingButton(elem) {
  // const previous = window.$(elem).html();
  return {
    loading: () => {
      $(elem).attr('disabled', true);
      $(elem).before(SPINNER_OVERLAY_BTN);
    },
    reset: () => {
      $(elem).removeAttr('disabled');

      $(elem)
        .prev('.loading-overlay-btn')
        .remove();
    }
  };
}

export function requiredInput(elem) {
    let ban = true
    if($(elem).val() === '' || $(elem).val() === null ){
      $(elem).parent().addClass('has-error');
      ban = false;
    }else{
      $(elem).parent().removeClass('has-error');

    }
    return ban;
}

export function getLoadingSection(elem) {
  return {
    loading: () => {
      $(elem).before(SPINNER_OVERLAY_SECTION);
    },
    reset: () => {
      $(elem)
        .prev('.loading-overlay-section')
        .remove();
    }
  };
}

export default {
  getLoadingButton,
  getLoadingSection,
  requiredInput
};
