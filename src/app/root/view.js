import Mn from 'backbone.marionette';
import template from './template.hbs';
import UsersView from '../users/view';
import OrganizationsView from '../organizations/view';
import SurveysView from '../surveys/view';

export default Mn.View.extend({
  template,

  regions: {
    content: '#content'
  },

  showUsers() {
    this.getRegion('content').show(new UsersView());
  },

  showOrganizations() {
    this.getRegion('content').show(new OrganizationsView());
  },
  showSurveys() {
    this.getRegion('content').show(new SurveysView());
  }
});
