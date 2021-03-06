import Bn from 'backbone';
import Mn from 'backbone.marionette';
import moment from 'moment';
import $ from 'jquery';

import Template from '../template.hbs';
import SnapshotsTemplate from '../show/snapshot/template.hbs';
import UnderConstrucionTemplate from '../../utils/under_construction_template.hbs';
import storage from '../storage';
import TermCondPolView from '../../termcondpol/view';
import TermCondPolModel from '../../termcondpol/model';

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
      createdAt: this.getCreatedAt(),
      className: this.isPrioritized()
    };
  },

  getCreatedAt() {
    const createdAt = this.model.attributes.snapshot_indicators.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('YYYY-MM-DD');
  },

  isPrioritized(){
    const isPrioritized = this.model.attributes.snapshot_indicators.indicators_priorities;
    if (!isPrioritized) {
      return null;
    }
    return isPrioritized.length > 0 ? 'hidden' : '' ;
  },

  getJsonData(){
    let data = {};

    data.firstName = this.model.attributes.person.firstName;
    data.lastName = this.model.attributes.person.lastName;
    data.identificationNumber = this.model.attributes.person.identificationNumber;
    data.identificationType = this.model.attributes.person.identificationType;
    data.birthdate = this.model.attributes.person.birthdate;
    data.countryOfBirth = this.model.attributes.person.countryOfBirth.alfa2Code;
    data.phoneNumber = this.model.attributes.person.phoneNumber;
    data.familyId = this.model.attributes.familyId;
    return data;
  },

  newSurvey(event){
    event.preventDefault();
    let self = this;
    this.app.getSession().save({termCond: 0, priv: 0});
    this.app.getSession().save({reAnswer: false, formData: null});
    const model = new TermCondPolModel();
    const app = this.app;
    model
      .fetch({
        data: {
          type: 'TC'
        }
      })
      .then(() => {
        this.app.showViewOnRoute(new TermCondPolView({

           app,
           model,
           surveyId: this.model.attributes.snapshot_indicators.survey_id,
           reAnswer: true,
           formData: self.getJsonData()

         }));
      });

    Bn.history.navigate(`/survey/${this.model.attributes.snapshot_indicators.survey_id}/termcondpol/TC`);

  }
});
