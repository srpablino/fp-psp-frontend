import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Form from '../../components/form';
import React from 'react';
import ReactDOM from 'react-dom';
import DefinitionModel from './new_survey_definition';
import SnapshotModel from '../snapshots/new_snapshot';
import _ from 'lodash';

export default Mn.View.extend({
  template: Template,

  events: {
    //'click #cancel': 'onCancel',
    'change #table-id': 'onSurveySelectChange'
  },

  initialize(options) {
    const { surveyId, handleCancel } = options;
    this.definitionModel = new DefinitionModel({ id: surveyId });
    this.props = {};
    this.props.handleCancel = handleCancel;
  },

  getLocalizedSchema(unlocalizedSchema) {
    const newSchema = Object.assign({}, unlocalizedSchema);
    // schema = {
    //   properties: {
    //    XYZ:
    //        { title: { es : value},
    //          type: string
    //        }
    //   }
    // transformar a:
    // newSchema.properties.XYZ.title = value;
    const newProps = _.mapValues(newSchema.properties, obj => {
      // obj = XYZ
      return _.mapValues(obj, obj2 => {
        // obj2 = title
        if (_.isObject(obj2) && obj2.hasOwnProperty('es')) {
          return obj2.es;
        }
        return obj2;
      });
    });
    newSchema.properties = newProps;
    return newSchema;
  },

  onRender() {
    this.renderForm();
  },
  renderForm() {
    const tableId = this.$el.find('#table-id').val();

    const placeHolder = this.$el.find('#new-survey')[0];

    this.definitionModel.fetch({ data: { table_id: tableId } }).then(result => {
      const { survey_schema } = result;
      const localizedSchema = this.getLocalizedSchema(survey_schema);
      this.reactView = React.createElement(Form, {
        schema: localizedSchema,
        handleSubmit: this.hadleSubmit.bind(this),
        handleCancel: this.props.handleCancel,
        view: this
      });
      ReactDOM.unmountComponentAtNode(placeHolder);
      ReactDOM.render(this.reactView, placeHolder);
    });
  },

  onCancel() {
    //this.props.handleCancel();
  },
  onSurveySelectChange(event) {
    this.renderForm();
  },
  hadleSubmit(formResult) {
    const tableId = this.$el.find('#table-id').val();
    const { formData } = formResult;
    new SnapshotModel()
      .save({ table_id: tableId, indicators_survey_data: formData })
      .then(result => {
        alert('Survey added!');
        this.props.handleCancel();
      });
  }
});
