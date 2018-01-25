import Mn from 'backbone.marionette';
import Bb from 'backbone';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    if (!this.model) {
      this.model = new Bb.Model();
    }
    return {
      home: this.model.attributes
    };
  }
});
