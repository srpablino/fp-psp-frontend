import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .card-menu-delete': 'handleDelete',
  },
  className:'col-lg-3 col-md-4 col-sm-6 col-xs-12',
  initialize(options) {
    this.deleteFamily = options.deleteFamily;
    this.model = options.model;
  },


  serializeData() {
    return {
      family: this.model.attributes
    };
  },

  handleDelete(event) {
    event.preventDefault();
    this.deleteFamily(this.model);
  },

});
