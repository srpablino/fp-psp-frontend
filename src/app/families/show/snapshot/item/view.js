import Mn from 'backbone.marionette';
import Template from './template.hbs';
import moment from 'moment';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    return {
      snapshot: this.model.attributes,
      createdAt: this.getCreatedAt()
    };
  },
  getCreatedAt() {
    const createdAt = this.model.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM');
  }
});
