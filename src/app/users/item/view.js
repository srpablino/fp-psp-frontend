import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    return {
      user: this.model.attributes,
      organizationLabel: this.model.get('organization') ? 'Organisation' : 'Hub',
      organization: this.model.get('organization') || this.model.get('application')
    };
  }
});
