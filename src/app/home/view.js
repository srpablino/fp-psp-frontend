import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  initialize(options) {
    this.totalFamilies = options.totalFamilies;
  },
  serializeData() {
    return {
      totalFamilies: this.totalFamilies
    };
  }
});
