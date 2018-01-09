import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';
import Template from './template.hbs';
import FlashesService from '../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #accept': 'handleNext',
    'change #agree':'showNextButton'
  },

  initialize(options) {
    this.model = options.model;
    this.app = options.app;
    this.surveyId = options.surveyId;     
  },

  onRender(){
    this.$el.find('#text').append(this.model.attributes.html);
  },

  showNextButton(event){
   event.preventDefault();
    let checked = $('#response input:radio:checked').val();
    if(checked){
      $('#accept').removeClass('disabled');
    }
    return true;
  },

  handleNext(event){
      event.preventDefault();
      let checked = $('#response input:radio:checked').val();   

      if(checked && checked==='Yes'  && this.model.attributes.type_cod==='TC'){
        localStorage.termCond = this.model.attributes.id;
        Bn.history.navigate(`/survey/${this.surveyId}/termcondpol/PRIV`, true);
      } else if(checked && checked==='Yes' && this.model.attributes.type_cod==='PRIV'){

        if(localStorage.termCond && localStorage.termCond>0){
          Bn.history.navigate(`/survey/${this.surveyId}/answer`, true);
        } else {
          return FlashesService.request('add', {
            timeout: 2000,
            type: 'info',
            title: `You must first accept the terms and conditions!`
          });
        }
      } else if(checked && checked==='No'){
        Bn.history.navigate(`/surveys`, true);
      } else if(!checked){
        return FlashesService.request('add', {
          timeout: 2000,
          type: 'info',
          title: `Select your answer!`
        });
      }
      
  }

});