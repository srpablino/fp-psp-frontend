import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #edit': 'handleEdit',
    'click #delete': 'handleDelete'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
  },

  serializeData() {
    return {
      organization: this.model.attributes
    };
  },

  handleEdit(event) {
    event.preventDefault();
    this.props.addOrganization(this.model);
  },
  handleDelete(event) {
    event.preventDefault();
    this.props.deleteOrganization(this.model);
  }
});
