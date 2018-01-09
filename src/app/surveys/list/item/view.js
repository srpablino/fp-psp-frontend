import Mn from 'backbone.marionette';
import Bn from 'backbone';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #edit': 'handleEdit',
    'click #delete': 'handleDelete',
    'click #show-snaps': 'handleShowSnapshots',
    'click #answer': 'handlerTermsAndConditions'
  },

  initialize(options) {
    this.deleteSurvey = options.deleteSurvey;
    this.model = options.model;
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
    this.deleteSurvey(this.model);
  },
  handleShowSnapshots(event) {
    if (event.target.tagName.toLowerCase() !== 'a') {
      return;
    }
    event.preventDefault();
    const route = event.target.getAttribute('href');
    Bn.history.navigate(route, true);
  },

  handlerTermsAndConditions(event){
    event.preventDefault();
    Bn.history.navigate(`/survey/${this.model.attributes.id}/termcondpol/TC`, true);
  },

  handleAnswer(event) {
    event.preventDefault();
    Bn.history.navigate(`/survey/${this.model.attributes.id}/answer`, true);
  }
});
