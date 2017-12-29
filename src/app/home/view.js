import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  initialize(options) {
    this.model = options.model;
  },
  serializeData() {
    return {
      dashboard: this.model.attributes
    };
  }
});
