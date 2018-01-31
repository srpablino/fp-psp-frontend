/* eslint no-prototype-builtins: 0 */
/* eslint camelcase: 0 */

import _ from 'lodash';
import $ from 'jquery';
import Bn from 'backbone';
import Mn from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';
import storage from '../storage';
import Template from './template.hbs';
import Form from '../../components/form';
import SurveyModel from '../../surveys/add/model';
import SnapshotModel from './model';
import SnapshotTmpModel from '../../snapshots_drafts/model';
import FlashesService from '../../flashes/service';

export default Mn.View.extend({
  template: Template,

  events: {
    'change #survey-id': 'onSurveySelectChange',
    'click #goback-btn': 'onGoBack'
  },

  initialize(options) {
    const { organizationId, surveyId, handleCancel, app } = options;
    this.surveyModel = new SurveyModel({ id: surveyId });
    this.surveyModel.on('sync', () => this.renderForm());
    this.surveyModel.fetch();

    this.props = {};
    this.props.handleCancel = handleCancel;
    this.props.surveyId = surveyId;
    this.props.organizationId = organizationId;

    this.app = app;
  },

  getLocalizedSchema(unlocalizedSchema) {
    const newSchema = Object.assign({}, unlocalizedSchema);

    const newProps = _.mapValues(newSchema.properties, obj =>
      _.mapValues(obj, obj2 => {
        if (_.isObject(obj2) && obj2.hasOwnProperty('es')) {
          return obj2.es;
        } else if (_.isObject(obj2) && obj2.hasOwnProperty('en')) {
          return obj2.en;
        }
        return obj2;
      })
    );
    newSchema.properties = newProps;
    return newSchema;
  },

  renderForm() {

    const parameters = {};
    parameters.survey_id = this.surveyModel.id;
    parameters.survey_name = this.surveyModel.attributes.title;
    const headerItems = storage.getSubHeaderItems(parameters);
    this.app.updateSubHeader(headerItems);

    const placeHolder = this.$el.find('#new-survey')[0];
    const { survey_schema } = this.surveyModel.attributes;
    const localizedSchema = this.getLocalizedSchema(survey_schema);
    const uiSchema = this.surveyModel.attributes.survey_ui_schema;

    this.reactView = React.createElement(Form, {
      schema: localizedSchema,
      uiSchema,
      handleSubmit: this.hadleSubmit.bind(this),
      handleCancel: this.props.handleCancel,
      handleSaveDraft: this.handleSaveDraft.bind(this),
      view: this
    });
    ReactDOM.unmountComponentAtNode(placeHolder);
    ReactDOM.render(this.reactView, placeHolder);
  },

  onGoBack() {
    this.props.handleCancel();
  },
  onSurveySelectChange() {
    this.renderForm();
  },
  getPersonal(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:personal']
    );
  },
  getIndicators(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:indicators']
    );
  },
  getEconomics(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:economics']
    );
  },

  fixedGalleryFieldValue(formData) {
    var customFields = this.surveyModel.attributes.survey_ui_schema[
      'ui:custom:fields'
    ];

    $.each(customFields, (i, item) => {
      if (item['ui:field'] && item['ui:field'] === 'gallery') {
        const itemSelected = formData[i];
        if (
          itemSelected &&
          itemSelected !== undefined &&
          Array.isArray(itemSelected)
        ) {
          formData[i] = itemSelected[0].value;
        }
      }
    });
  },

  hadleSubmit(formResult) {
    // Convert from array to string, using property "value"
    this.fixedGalleryFieldValue(formResult);

    const snapshot = {
      survey_id: this.props.surveyId,
      organization_id: this.props.organizationId,
      personal_survey_data: this.getPersonal(formResult),
      indicator_survey_data: this.getIndicators(formResult),
      economic_survey_data: this.getEconomics(formResult),
      user_name: this.app.getSession().get('user').username,
      term_cond_id: this.app.getSession().get('termCond'),
      priv_pol_id: this.app.getSession().get('priv')
    };

    new SnapshotModel().save(snapshot).then(savedSnapshot => {
      Bn.history.navigate(
        `/survey/${savedSnapshot.survey_id}/snapshot/${
          savedSnapshot.snapshot_economic_id
        }`,
        true
      );
    });

    this.app.getSession().save({termCond: 0, priv: 0});
  },

  handleSaveDraft(state){

    const snapshot = {
      survey_id: this.props.surveyId,
      last_name: state.formData.lastName,
      first_name: state.formData.firstName,
      user_name: this.app.getSession().get('user').username,
      term_cond_id: this.app.getSession().get('termCond'),
      priv_pol_id: this.app.getSession().get('priv'),
      state_draft: state,
      economic_response: this.getEconomics(state.formData),
      indicator_response: this.getIndicators(state.formData),
      personal_response: this.getPersonal(state.formData)
    }

    new SnapshotTmpModel().save(snapshot).then(

      () => {
        
        FlashesService.request('add', {
          timeout: 2000,
          type: 'info',
          title: 'The information has been saved'
        });

        Bn.history.navigate(`/surveys`, true);
      },
      error => {
        FlashesService.request('add', {
          timeout: 2000,
          type: 'warning',
          title: error.responseJSON.message
        });
      }
    );
  }

});
