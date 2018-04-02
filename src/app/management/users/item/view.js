import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events:{
    'click a':'preventDefault'
  },
  serializeData() {
    return {
      user: this.model.attributes,
      organizationLabel: this.model.get('organization') ? t('user.card.organization') : t('user.card.hub'),
      organization: this.model.get('organization') || this.model.get('application')
    };
  },
  // Item functions not implemented yet
  preventDefault(e) {
    if(e) e.preventDefault();
  }
});
