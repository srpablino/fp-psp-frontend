import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Bn from 'backbone';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #edit': 'handleEdit',
    'click #delete': 'handleDelete',
    'click #show-snaps': 'handleShowSnapshots'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
  },

  serializeData() {
    return {
      survey: this.model.attributes
    };
  },

  handleEdit(event) {
    event.preventDefault();
    this.props.addSurvey(this.model);
  },
  handleDelete(event) {
    event.preventDefault();
    this.props.deleteSurvey(this.model);
  },
  handleShowSnapshots(event) {
    if (event.target.tagName.toLowerCase() !== 'a') {
      return;
    }
    event.preventDefault();
    const route = event.target.getAttribute('href');
    Bn.history.navigate(route, true);
  }
});
