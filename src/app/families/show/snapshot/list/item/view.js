import Mn from 'backbone.marionette';
import moment from 'moment';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    return {
      snapshot: this.model.attributes,
      createdAt: this.getCreatedAt(),
      snapshotIndicators: this.model.attributes.indicators_survey_data.map(
        set => ({
          clazz: set.value !== null ? set.value.toLowerCase() : 'gray',
          value: set.value,
          name: set.name
        })
      )
    };
  },
  getCreatedAt() {
    const createdAt = this.model.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  }
});
