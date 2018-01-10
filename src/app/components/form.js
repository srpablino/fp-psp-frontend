import React, { Component } from 'react';
import JsonSchemaForm from 'react-jsonschema-form';
import Gallery from './gallery';
import Gmap from './gmap';

const log = type => console.log.bind(console, type);

class Form extends Component {
  constructor(props) {
    super(props);

    let order = props.uiSchema['ui:order'];
    let stepsSchema = [];
    let stepsUISchema = [];

    this.counter = {
      countEconomic: 0,
      countIndicator: 0,
      countPersonal: 0
    };

    let component = this;
    for (let i = 0; i < order.length; i++) {
      stepsSchema.push(component.schemaNewEntry(props.schema, order[i]));
      stepsUISchema.push(component.uischemaNewEntry(props.uiSchema, order[i]));
    }

    this.state = {
      step: 0,
      formData: {},
      stepsSchema,
      stepsUISchema
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  uischemaNewEntry(uischema, key) {
    var uischemaToRet = {};
    uischemaToRet.key = key;
    uischemaToRet.properties = {};

    uischemaToRet['ui:group:economics'] = [];
    uischemaToRet['ui:group:indicators'] = [];

    if (uischema.properties && uischema.properties[key]) {
      uischemaToRet.properties[key] = uischema.properties[key];
    }
    if (uischema['ui:custom:fields'] && uischema['ui:custom:fields'][key]) {
      uischemaToRet[key] = uischema['ui:custom:fields'][key];
    }
    if (
      uischema['ui:group:economics'] &&
      uischema['ui:group:economics'].includes(key)
    ) {
      uischemaToRet['ui:group:economics'].push(key);
    }
    if (
      uischema['ui:group:indicators'] &&
      uischema['ui:group:indicators'].includes(key)
    ) {
      uischemaToRet['ui:group:indicators'].push(key);
    }

    return uischemaToRet;
  }

  schemaNewEntry(schema, key) {
    var schemaToRet = JSON.parse(JSON.stringify(schema));
    schemaToRet.key = key;
    schemaToRet.properties = {};
    schemaToRet.required = [];
    schemaToRet.properties[key] = schema.properties[key];

    if (schema.required && schema.required.includes(key)) {
      schemaToRet.required.push(key);
    }
    if (
      this.props.uiSchema['ui:group:economics'] &&
      this.props.uiSchema['ui:group:economics'].includes(key)
    ) {
      this.counter.countEconomic++;
      schemaToRet.description = `Socio-economic Information ${
        this.counter.countEconomic
      }/`;
      schemaToRet.counter = 'countEconomic';
    }
    if (
      this.props.uiSchema['ui:group:indicators'] &&
      this.props.uiSchema['ui:group:indicators'].includes(key)
    ) {
      this.counter.countIndicator++;
      schemaToRet.counter = 'countIndicator';
      schemaToRet.description = `Indicators ${this.counter.countIndicator}/`;
    }
    if (
      this.props.uiSchema['ui:group:personal'] &&
      this.props.uiSchema['ui:group:personal'].includes(key)
    ) {
      this.counter.countPersonal++;
      schemaToRet.counter = 'countPersonal';
      schemaToRet.description = `Personal Information ${
        this.counter.countPersonal
      }/`;
    }
    return schemaToRet;
  }

  onSubmit(data) {
    var newData = JSON.parse(JSON.stringify(this.state.formData));
    var currentStep = this.state.stepsSchema[this.state.step];
    newData[currentStep.key] = data.formData[currentStep.key];

    if (this.state.step < this.state.stepsSchema.length - 1) {
      this.setState({
        step: this.state.step + 1,
        formData: newData
      });
    } else {
      this.setState({
        formData: newData
      });
      this.onSubmit = this.props.handleSubmit(newData);
    }
  }

  onCancel() {
    var newData = JSON.parse(JSON.stringify(this.state.formData));
    this.state.stepsSchema[this.state.step];

    if (this.state.step > 0) {
      this.setState({
        step: this.state.step - 1,
        formData: newData
      });
    } else {
      this.setState({
        formData: {}
      });
      this.props.handleCancel();
    }
  }

  render() {
    return (
      <div>
        <label className="progress-survey">
          {' '}
          {this.state.stepsSchema[this.state.step].description}
          {this.counter[this.state.stepsSchema[this.state.step].counter]}
        </label>
        <hr className="progress-rule" />
        <JsonSchemaForm
          schema={this.state.stepsSchema[this.state.step]}
          uiSchema={this.state.stepsUISchema[this.state.step]}
          fields={{ gallery: Gallery, gmap: Gmap }}
          onSubmit={this.onSubmit}
          onError={log('errors')}
          formData={this.state.formData}
        >
          <div>
            <button
              type="button"
              onClick={() => this.onCancel(this.state.formData)}
              className="btn btn-circle survey-previous"
            >
              <i className="fa fa-chevron-left" />
            </button>
            <button type="submit" className="btn btn-circle survey-next">
              <i className="fa fa-chevron-right" />
            </button>
          </div>
        </JsonSchemaForm>
      </div>
    );
  }
}

export default Form;
