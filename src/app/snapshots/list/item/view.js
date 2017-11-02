import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _ from 'lodash';
import moment from 'moment';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
  },

  serializeData() {
    const keysToPick = _.keys(this.model.attributes.economic_survey_data).slice(
      0,
      4
    );
    const snapshots = [];
    snapshots.push(this.getCreatedAt());

    _.forOwn(
      _.pick(this.model.attributes.economic_survey_data, keysToPick),
      (value, key) => {
        snapshots.push(`<label>${key}:</label> ${value}`);
      }
    );

    return {
      snapshots: snapshots
    };
  },
  getCreatedAt() {
    const createdAt = this.model.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    const formatted = moment(createdAt).format('D/M/YYYY hh:mm:ss');
    return `<div class="pull-right">${formatted}</div>`;
  }
});
