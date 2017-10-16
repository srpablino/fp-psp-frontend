import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Model from './model';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #cancel': 'handleCancel',
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model || new Model();
  },

  handleCancel() {
    this.props.listOrganizations();
  },
  serializeData() {
    return {
      organization: this.model.attributes
    };
  },
  handleSubmit(event) {
    event.preventDefault();

    // We manually add form values to model,
    // the form -> model binding should ideally
    // be done automatically.
    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });

    this.model.save().then(result => {
      this.props.listOrganizations();
    });
  }
});
