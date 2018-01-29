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

    if(!props.stateDraft){
      this.state = {
        step: 0,
        formData: {},
        stepsSchema,
        stepsUISchema
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
      }
    });
    
    const stepKey = this.props.stateDraft.stepsSchema[this.props.stateDraft.step].key;
    let indexActualKey = -1;
    let firstIndexNotFound = -1;

    // Case2: the fields order were changed.
    
    for(let i=0; i < stepsSchema.length; i++){
      if(stepsSchema[i].key === stepKey){
        indexActualKey = i;
      } 
    
    // Case 3: the field change from optional to required.

     if(stepsSchema[i].required.length>0 && firstIndexNotFound===-1 && this.props.stateDraft.formData[stepsSchema[i].key] === undefined){
        firstIndexNotFound = i;
      }
    }
    
    if(indexActualKey!==-1){
      if(this.props.stateDraft.step + 1 >= indexActualKey){
        this.state = {
          step: indexActualKey,
          formData: this.props.stateDraft.formData,
          stepsSchema,
          stepsUISchema
        };
      } else {
        this.state = {
          step: firstIndexNotFound,
          formData: this.props.stateDraft.formData,
          stepsSchema,
          stepsUISchema
        };
      }
    }  
    
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
        formData: newData
      });
    } else {
      this.setState({
        formData: {}
      });
      this.props.handleCancel();
    }

  }

  onSaveDraft(){
    if(this.checkShowSaveDraft(this.state)){
    // When a survey has not been completed and we want to save a draft
    // , the method handleSaveDraft is called.
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

  render() {

    return (
      <div>
        {this.checkShowSaveDraft(this.state)? 
          <button className="btn btn-primary pull-right" id="save-draft" onClick={() => this.onSaveDraft()}> Save Draft </button> :'' }
        <br />
        <br />
      
        <article className="card animated fadeInLeft">
          <div className="card-block">
            <div className="survey-container">
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
          </div>
          <br />
        </article>
      </div>
    );
  }
}

export default Form;
