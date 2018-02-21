import Bn from 'backbone';
import Mn from 'backbone.marionette';
import moment from 'moment';
import $ from 'jquery';

import Template from '../template.hbs';
import SnapshotsTemplate from '../show/snapshot/template.hbs';
import UnderConstrucionTemplate from '../../utils/under_construction_template.hbs';
import storage from '../storage';
// import SnapshotView from '../../snapshots/add/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #newSurvey': 'newSurvey'
  },

  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);

    if (this.entity == null) {
      $('#sub-header .navbar-header > .navbar-brand').addClass('subActive');
    } else {
      $(`.sub-menu-tiem > a[href$="${this.entity}"]`)
        .parent()
        .addClass('subActive');
    }
  },

  getTemplate() {
    if (this.entity === 'interventions') {
      // return InterventionsTemplate;
      return UnderConstrucionTemplate;
    }
    if (this.entity === 'snapshots') {
      return SnapshotsTemplate;
    }
    return Template;
  },

  serializeData() {
    return {
      family: this.model.attributes,
      createdAt: this.getCreatedAt()
    };
  },

  getCreatedAt() {
    const createdAt = this.model.attributes.snapshot_indicators.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  },

  newSurvey(event){
    event.preventDefault();
     Bn.history.navigate(`/survey/${this.model.attributes.snapshot_indicators.survey_id}/answer`, true);
  }
});
