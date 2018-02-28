import Bn from "backbone";
import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click .card-menu-delete':'delete:model'
  },
  events: {
    'click .card-menu-edit':'editOrganization'
  },
  serializeData() {
    return {
      organization: this.model.attributes,
      logoUrl: this.model.get('logoUrl') || '/static/images/icon_logo_place.png'
    };
  },
  editOrganization(event){
    event.preventDefault();

    Bn.history.navigate(`/organizations/edit/${this.model.get('id')}`, true);
  }
});
