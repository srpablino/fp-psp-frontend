import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Bn from 'backbone';
// import ModalService from '../../modal/service';
// import FlashesService from '../../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #delete': 'handleDelete',
  },
  initialize(options) {
    this.deleteSurvey = options.deleteSurvey;
    this.model = options.model;
  },


  serializeData() {
    return {
      family: this.model.attributes
    };
  },

  handleDelete(event) {
    event.preventDefault();
    //deleteSurvey(this.model);
    this.deleteSurvey(this.model);
  },

  // deleteSurvey(model) {
  //   event.preventDefault();
  //   ModalService.request('confirm', {
  //     title: 'Confirm Deletion',
  //     text: `Are you sure you want to delete all the information about your family?\n\n
  //      Once you have deleted you will not able to go back`
  //   }).then(confirmed => {
  //     if (!confirmed) {
  //       return;
  //     }
  //     //this.collection.remove(model);
  //     return this.handleDestroySuccess(model);
  //   });
  // },
  // handleDestroySuccess(model) {
  //
  //   return FlashesService.request('add', {
  //     timeout: 5000,
  //     type: 'info',
  //     body: 'The survey has been deleted!'
  //   });
  // }

});
