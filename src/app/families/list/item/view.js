import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
  },

  serializeData() {
    return {
      family: this.model.attributes
    };
  }
});
