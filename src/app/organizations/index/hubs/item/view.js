import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click #delete': 'delete:item'
  },
  serializeData() {
    return {
      hub: this.model.attributes
    };
  },
  handleDelete(event) {
    event.preventDefault();
    this.trigger('delete:model', this.model);
  }
});
