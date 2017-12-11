import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _ from 'lodash';
import moment from 'moment';
import PriorityView from './priority/view';
import datetimepicker from 'eonasdan-bootstrap-datetimepicker';
import $ from 'jquery';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #circle': 'handlerOnClickIndicator'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
    console.log(this);
  },

  serializeData() {
    const snapshot = [];
    const header = this.createHeaderRepresentation();
    const indicators = this.createIndicatorRepresentation(this.model.attributes.indicators_survey_data);

    header.forEach(function(v) {snapshot.push(v)});
    indicators.forEach(function(v) {snapshot.push(v)});

    const priorities = this.showIndicatorsPriorities();
    priorities.forEach(function(v) {snapshot.push(v)});
    
    return {
      snapshots: snapshot
    };
  },

  createIndicatorRepresentation(indicators){
    var snapshotView = [];
    snapshotView.push(`<div class="indicators-snapshot" >`);
    if(indicators!==undefined && Array.isArray(indicators)){
      indicators.forEach((element, index ) => {
        snapshotView.push(
        `<div class="indicator-circle-snapshot "> 
            <div id="circle" class="circle-content ${element['value'].toLowerCase()}"  />
            <p id="indicator-name" >${element['name']}</p> 
            <p hidden id="indicator-value">${element['value']}</p>
        </div> `);  
        }
      );
    }

    snapshotView.push(`</div>`);
    return snapshotView;
  }, 

  createHeaderRepresentation(){
    var headerView = [];
    headerView.push((
      `<div class="header-indicators-snapshot"> 
          <h3 class="pull-left"> SNAPSHOT  ${this.getCreatedAt()} </h3> 
          <div class="pull-right header-resume">
            <p>${this.model.attributes.count_red_indicators}</p>
            <div class="circle-header red " />
            <p>${this.model.attributes.count_yellow_indicators}</p>
            <div class="circle-header yellow " />
            <p>${this.model.attributes.count_green_indicators}</p>
            <div class="circle-header green " />
          </div>
      </div>`));

    const keysToPick = _.keys(this.model.attributes.family_data);
    _.forOwn(
       _.forEach(this.model.attributes.family_data, keysToPick),
       (value, key) => {
         headerView.push(`<label>${key}:</label> ${value}`);
      }
    );
    headerView.push(`<hr></hr>`);
     
    return headerView;
  },

  getCreatedAt() {
    const createdAt = this.model.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('D/M/YYYY hh:mm:ss');
  }, 

  handlerOnClickIndicator(e){
    const indicatorSelected = e.target.parentNode.children['indicator-name'].innerHTML;
    const indicatorSelectedValue = e.target.parentNode.children['indicator-value'].innerHTML;
    
    if(indicatorSelectedValue.toUpperCase()==='GREEN'){
      return;
    }
    this.showDialogPriority(indicatorSelected);
    this.priorityDialog.open();
    console.log('volvio del dialogo');
    console.log(this);


  },

  showDialogPriority(indicator){
    const dataIdConfirmOperacion = Math.random();

    this.priorityDialog  = new PriorityView({
      dataId:dataIdConfirmOperacion,
      indicatorName:indicator,
      snapshotIndicatorId:this.model.attributes.snapshot_indicator_id,
      obj:this
    });

    $('#modal-region').append(this.priorityDialog.render().el);
  }, 

  showIndicatorsPriorities(){
    var priorities = [];
    const indicatorsPriorities = this.props.model.attributes.indicators_priorities;
    if(indicatorsPriorities!==undefined && Array.isArray(indicatorsPriorities) && indicatorsPriorities.length>0){
    priorities.push(`<br/> <br/> <table class="table table-hover margin bottom center" id="prioritiesTable" >
	  <thead  class="thead-light">
	    <tr>
	      <th>Indicator</th>
	      <th>Why? I do not have it?</th>
	      <th>What to do? to have it?</th>
	      <th>When you achieve it?</th>
	    </tr>
	  </thead>
	  <tbody id="tbodypriorities">   `);

    indicatorsPriorities.forEach((element, index) => {
      priorities.push(`<tr> 
        <td> ${element.indicator}</td>
        <td> ${element.reason}</td>
        <td> ${element.action}</td>
        <td> ${element.estimated_date}</td>
      <tr/>`);

    });

    priorities.push(`</tbody>
      </table>`);
  }
    return priorities;

  }

});
