import Mn from 'backbone.marionette';
import Template from './template.hbs';
import OrganizationListView from './list/view';
import AddOrganizationView from './add/view';

export default Mn.View.extend({
  template: Template,
  regions: {
    organizations: '#organizations-region'
  },
  initialize() {},
  onRender() {
    this.listOrganizations();
  },
  listOrganizations() {
    const listView = new OrganizationListView({
      addOrganization: this.addOrganization.bind(this)
    });
    this.getRegion('organizations').show(listView);
  },
  addOrganization(model) {
    const addView = new AddOrganizationView({
      model: model,
      listOrganizations: this.listOrganizations.bind(this)
    });
    this.getRegion('organizations').show(addView);
  }
});
