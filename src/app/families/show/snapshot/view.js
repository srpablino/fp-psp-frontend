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
      snapshotIndicators: this.snapshotModel.attributes.indicators_survey_data.map(
        set => ({
          image: this.stoplightImage(set.value),
          value: set.value,
          name: set.name
        })
      )
    };
  },
  formatCreatedDate() {
    const createdAt = this.snapshotModel.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  },
  stoplightImage(color) {
    if (color === 'GREEN') {
      return '/static/images/icon_elipse_verde_02.png';
    } else if (color === 'YELLOW') {
      return '/static/images/icon_elipse_amarillo_02.png';
    } else if (color === 'RED') {
      return '/static/images/icon_elipse_rojo_02.png';
    }else if (color === 'NONE') {
      return '/static/images/icon_elipse_gris_02.png';
    }
  }
});
