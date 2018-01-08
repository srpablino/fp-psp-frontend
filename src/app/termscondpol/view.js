import Mn from 'backbone.marionette';

import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #acceptTerm': 'handleShowTermConditions'
  },

  initialize() {

            
  },

  onRender(){
    this.getRegion('term-cond-pol').show();

  },

  handleShowTermConditions(event){
      event.preventDefault();
  }

});