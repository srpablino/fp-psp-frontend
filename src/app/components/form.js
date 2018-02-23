import React, { Component } from 'react';
import JsonSchemaForm from 'react-jsonschema-form';
import Gallery from './gallery';
import Gmap from './gmap';
import NumberFormat from './number';
import DatetimeFormat from './datetime';

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

    if(props.reAnswer){
      this.state = {
        step: 0,
        formData: props.formData,
        stepsSchema,
        stepsUISchema,
        lastValue: {}
      };

    }else if(!props.stateDraft){
        this.state = {
          step: 0,
          formData: {},
          stepsSchema,
          stepsUISchema,
          lastValue: {}
        };
    } else {
        // If the survey definition was changed, we should update this.state.
        this.updateState(stepsSchema, stepsUISchema);

    }

    this.onSubmit = this.onSubmit.bind(this);
  }

  updateState(stepsSchema, stepsUISchema){

    // Case 1: one o more fields were removed.

    const formDataCopy = this.props.stateDraft.formData;

    Object.keys(formDataCopy).forEach(field => {
      if(!this.existInSchemaGroup(field)){
        delete this.props.stateDraft.formData[field];
        this.props.stateDraft.step = this.props.stateDraft.step -1;
      }
    });

    this.state = {
      step: this.getSavedDraftStep(stepsSchema),
      formData: this.props.stateDraft.formData,
      stepsSchema,
      stepsUISchema,
      lastValue: this.props.stateDraft.formData
    };
  }

  getSavedDraftStep(stepsSchema){
    const stepKey = this.props.stateDraft.stepsSchema[this.props.stateDraft.step].key;
    let indexActualKey = -1;
    let firstIndexNotFound = -1;

    // Case2: the fields order were changed.

    for(let i=0; i < stepsSchema.length; i++){
      if(stepsSchema[i].key === stepKey){
        indexActualKey = i + 1;
      }

    // Case 3: the field wasn't answered (for example, changed from optional to required).
    // stepsSchema[i].required.length>0 &&
     if(firstIndexNotFound===-1 && this.props.stateDraft.formData[stepsSchema[i].key] === undefined){
        firstIndexNotFound = i;
      }
    }

    if(indexActualKey!==-1){
      if(this.props.stateDraft.step + 1 >= indexActualKey){
        return indexActualKey;
      }
      return firstIndexNotFound;
    }
    return this.props.stateDraft.step;

  }

  existInSchemaGroup(field){
    return this.props.uiSchema['ui:group:personal'].includes(field) ||
            this.props.uiSchema['ui:group:economics'].includes(field) ||
            this.props.uiSchema['ui:group:indicators'].includes(field);
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

    if (
      uischema['ui:group:personal'] &&
      uischema['ui:group:personal'].includes(key)
    ) {
      if(this.props.reAnswer)  uischemaToRet[key] = {"ui:readonly": true};
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
        formData: newData,
        lastValue: newData
      });
    } else {
      this.setState({
        formData: newData,
        lastValue: newData
      });
      this.onSubmit = this.props.handleSubmit(newData, this.props.draftId);
    }
  }

  onCancel() {
    // $('panel-danger').empty();
    var newData = JSON.parse(JSON.stringify(this.state.formData));
    this.state.stepsSchema[this.state.step];


    if (this.state.step > 0) {
      this.setState({
        step: this.state.step - 1,
        formData: newData,
        lastValue: newData
      });
    } else {
      this.setState({
        formData: {},
        lastValue: {}
      });
      this.props.handleCancel();
    }

  }

  onSaveDraft(){
    // When a survey has not been completed and we want to save a draft
    // , the method handleSaveDraft is called.

    if(this.checkShowSaveDraft(this.state)){

      // We should obtain an actual data in the form for
      // store in the draft

      let newData = JSON.parse(JSON.stringify(this.state.formData));
      let currentStep = this.state.stepsSchema[this.state.step];

      if(this.state.lastValue !== this.state.formData){
        newData[currentStep.key] = this.state.lastValue[currentStep.key];
      } else if(currentStep.properties[currentStep.key].default){
        newData[currentStep.key] = currentStep.properties[currentStep.key].default;
      }

      this.state.formData = newData;
      this.props.handleSaveDraft(this.state);

    } else {
      this.render();
    }
  }

  checkShowSaveDraft(state){
    let show = true;

    if(this.props.uiSchema['ui:group:personal'].length === 0){
      show = false;
    } else if(!state.formData){
      show = false;
    }else {
      for(let i=0; i<this.props.uiSchema['ui:group:personal'].length; i++){
        if(!state.formData[this.props.uiSchema['ui:group:personal'][i]]){
          show = false;
        }
      }
    }

    return show;
  }

  onChange(data){
    this.state.lastValue = data.formData;
  }

  render() {

    return (
      <div className="col-md-12">
        {this.checkShowSaveDraft(this.state)?
          <button className="btn btn-primary pull-right marginDraft" onClick={() => this.onSaveDraft()}> Save Draft </button> :'' }


        <article className="card">
          <div className="card-block">
            <div id="new-survey-2" className="row">
              <div className="col-md-12 survey-container">
                <label className="progress-survey">
                  {' '}
                  {this.state.stepsSchema[this.state.step].description}
                  {this.counter[this.state.stepsSchema[this.state.step].counter]}
                </label>
                <hr className="progress-rule" />
                <JsonSchemaForm
                  schema={this.state.stepsSchema[this.state.step]}
                  uiSchema={this.state.stepsUISchema[this.state.step]}
                  fields={{ gallery: Gallery, gmap: Gmap, numberFormat: NumberFormat, date:DatetimeFormat }}
                  onSubmit={this.onSubmit}
                  onError={log('errors')}
                  formData={this.state.formData}
                  onChange={(event) => {this.onChange(event)}}
                >
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
                </JsonSchemaForm>
              </div>
            </div>
          </div>
        </article>
      </div>

    );
  }
}

export default Form;
