import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Form from '../../components/form';
import React from 'react';
import ReactDOM from 'react-dom';
import DefinitionModel from './new_survey_definition';
import SnapshotModel from '../snapshots/new_snapshot';

export default Mn.View.extend({
  template: Template,

  events: {
    'click #cancel': 'onCancel'
  },

  initialize(options) {
    const { surveyId, handleCancel } = options;
    this.definitionModel = new DefinitionModel({ id: surveyId });
    this.props = {};
    this.props.handleCancel = handleCancel;
  },

  onRender() {
    const placeHolder = this.$el.find('#new-survey')[0];
    this.definitionModel.fetch().then(result => {
      const { survey_schema } = result;
      this.reactView = React.createElement(Form, {
        schema: survey_schema,
        handleSubmit: this.hadleSubmit.bind(this),
        handleCancel: this.props.handleCancel,
        view: this
      });
      ReactDOM.unmountComponentAtNode(placeHolder);
      ReactDOM.render(this.reactView, placeHolder);
    });
  },

  onCancel() {
    this.props.handleCancel();
  },

  hadleSubmit(formResult) {
    const { formData } = formResult;

    new SnapshotModel().save({ survey_data: formData }).then(result => {
      console.log('result', result);
      alert('Form saved');
    });
  }
});
