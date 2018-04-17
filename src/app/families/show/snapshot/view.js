import Mn from 'backbone.marionette';
import moment from 'moment';

import Template from './template.hbs';
import storage from '../../storage';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.app = options.app;
    this.snapshotId = options.snapshotId;
    this.model = options.model;
    this.snapshotModel = options.snapshotModel;
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);
  },
  serializeData() {
    return {
      snapshot: this.snapshotModel.attributes,
      createdAt: this.formatCreatedDate(),
      className: this.isPrioritized(),
      snapshotIndicators: this.snapshotModel.attributes.indicators_survey_data.map(
        set => ({
          clazz: set.value !== null ? set.value.toLowerCase() : 'gray',
          value: set.value,
          name: set.name
        })
      )
    };
  },
  isPrioritized(){
    return this.model.attributes.snapshot_indicators.indicators_priorities.length > 0 ? 'hidden' : '' ;
  },
  formatCreatedDate() {
    const createdAt = this.snapshotModel.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  }
});
