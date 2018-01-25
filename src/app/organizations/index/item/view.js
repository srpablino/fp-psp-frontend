import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click #delete': 'delete:item',
    'click .card-menu-edit':'editOrg',
    'click .card-menu-delete':'deleteOrg'
  },
  serializeData() {
    return {
      organization: this.model.attributes,
      logoUrl: this.model.get('logoUrl') || '/static/images/icon_logo_place.png'
    };
  },
  handleDelete(event) {
    event.preventDefault();
    this.trigger('delete:model', this.model);
  },
  // TODO: implementar
  editOrg(e){
    e.preventDefault();
  },
  deleteOrg(e){
    e.preventDefault();
  }
});
