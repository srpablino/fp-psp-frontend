import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,

  serializeData() {
    return {
      family: this.model.attributes
    };
  }
});
