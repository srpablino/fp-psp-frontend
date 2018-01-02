import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    if (!this.model) { 
      this.model = new Backbone.Model();
    }
    return {
      home: this.model.attributes
    };
  }
});
