import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';
import Template from './template.hbs';
import FlashesService from '../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #accept': 'handleNext',
    'change #agree':'showNextButton',
    'change #dontAgree':'showNextButton'
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
 
  },

  handleNext(event){
      event.preventDefault();
      let checked = $('#response input:radio:checked').val();   

      if(!checked){
        return FlashesService.request('add', {
          timeout: 2000,
          type: 'info',
          title: `Select your answer!`
        });
      } else if(checked){
        if(checked==='Yes'  && this.model.attributes.type_cod==='TC'){
          this.app.getSession().save({termCond: this.model.attributes.id});
          Bn.history.navigate(`/survey/${this.surveyId}/termcondpol/PRIV`, true);
        } else if(checked==='Yes' && this.model.attributes.type_cod==='PRIV'){
  
          if(this.app.getSession().get('termCond') && this.app.getSession().get('termCond')>0){
            this.app.getSession().save({priv: this.model.attributes.id});
            Bn.history.navigate(`/survey/${this.surveyId}/answer`, true);
          } else {
            return FlashesService.request('add', {
              timeout: 2000,
              type: 'info',
              title: `You must first accept the terms and conditions!`
            });
          }
        } else if(checked==='No'){
          Bn.history.navigate(`/surveys`, true);
        }

      }  
  }

});