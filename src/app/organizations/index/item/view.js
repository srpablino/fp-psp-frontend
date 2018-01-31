import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click .card-menu-delete':'delete:model'
  },
  events: {
    'click .card-menu-edit':'editOrg'
  },
  serializeData() {
    return {
      organization: this.model.attributes
    };
  },
  // TODO: implementar
  editOrg(e){
    e.preventDefault();
  }
});
