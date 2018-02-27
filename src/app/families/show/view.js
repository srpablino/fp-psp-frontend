import Bn from 'backbone';
import Mn from 'backbone.marionette';
import moment from 'moment';
import $ from 'jquery';

import Template from '../template.hbs';
import SnapshotsTemplate from '../show/snapshot/template.hbs';
import UnderConstrucionTemplate from '../../utils/under_construction_template.hbs';
import storage from '../storage';
 import SnapshotView from '../../snapshots/add/view';

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

  getJsonData(){
    let data = {};
    data.firstName = this.model.attributes.person.firstName;
    data.lastName = this.model.attributes.person.lastName;
    data.identificationNumber = this.model.attributes.person.identificationNumber;
    data.identificationType = this.model.attributes.person.identificationType;
    data.birthdate = this.model.attributes.person.birthdate;
    data.countryOfBirth = this.model.attributes.country.alfa2code;
    data.phoneNumber = this.model.attributes.person.phoneNumber;
    return data;
  },

  newSurvey(event){
    event.preventDefault();
    let self = this;
    this.app.getSession().save({termCond: 0, priv: 0});
    const newSnapshotView = new SnapshotView({

      surveyId: this.model.attributes.snapshot_indicators.survey_id,
      handleCancel() {
        Bn.history.navigate(`/surveys`, true);
      },
       app: this.app,
       reAnswer: true,
       formData: self.getJsonData()
    });

    this.app.showViewOnRoute(newSnapshotView);

     Bn.history.navigate(`/survey/${this.model.attributes.snapshot_indicators.survey_id}/reanswer/${this.model.attributes.familyId}`, { replace: true });
  }
});
