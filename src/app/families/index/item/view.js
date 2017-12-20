import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,

  serializeData() {
    console.log('serialize data family model');
    console.log(this.model);
    return {
      family: this.model.attributes
    };
  }
});
