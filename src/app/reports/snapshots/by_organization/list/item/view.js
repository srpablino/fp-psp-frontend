import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  regions: {
    list: `#family-snapshot-items`
  },

  initialize(options){
    this.model = options.model;
  },

  serializeData() {
    return {
     snapshots: this.model.attributes
    };
  }

  
});