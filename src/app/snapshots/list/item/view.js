import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _ from 'lodash';
import moment from 'moment';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
  },

  serializeData() {

    const snapshot = [];
    this.snapshotData = this.getSnapshot();

    const header = this.createHeaderRepresentation();
    const indicators = this.createIndicatorRepresentation(this.snapshotData['indicators']);

    header.forEach(function(v) {snapshot.push(v)});
    indicators.forEach(function(v) {snapshot.push(v)});
    
    return {
      snapshots: snapshot
    };
  },

  getCreatedAt() {
    const createdAt = this.model.attributes.created_at;
    if (!createdAt) {
      return null;
    }
    return moment(createdAt).format('D/M/YYYY hh:mm:ss');
  },

  getSnapshot(){
    var indicators = this.getIndicators();
    var snapshot = {};
    snapshot['created_at'] = this.getCreatedAt();
    snapshot['indicators'] = indicators.indicators;
    snapshot['count_red'] = indicators.red;
    snapshot['count_yellow'] = indicators.yellow;
    snapshot['count_green'] = indicators.green;
    return snapshot; 
  },
  
  getIndicators(){
    var toRet = {};
    var indicators = [];
    var red = 0;
    var green = 0;
    var yellow = 0;

    this.model.attributes.indicators_survey_data.forEach( element => {
      const keysToPick = _.keys(element);
      _.forOwn(
        _.pick(element, keysToPick),
        (value, key) => {

          if(key==='value'){
            switch (value.toUpperCase()){
              case 'RED':
                red++;
                break;
              case 'GREEN':
                green++;
                break;
              case 'YELLOW':
                yellow++;
                break;
            }
          }
        }
      );
    });
    toRet.indicators = this.model.attributes.indicators_survey_data;
    toRet.red = red;
    toRet.yellow = yellow;
    toRet.green = green;
    return toRet;
  },

  createIndicatorRepresentation(indicators){
    var snapshotView = [];
    snapshotView.push(`<div class="indicators-snapshot" >`);
    if(indicators!==undefined && Array.isArray(indicators)){
      indicators.forEach(element => {
        snapshotView.push(
        `<div class="indicator-circle-snapshot "> 
            <div class="circle-content ${element['value'].toLowerCase()}" />
            <p>${this.getName(element['name'])}</p> 
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
          <h3 class="pull-left"> SNAPSHOT  ${this.snapshotData.created_at} </h3> 
          <div class="pull-right header-resume">
            <p>${this.snapshotData.count_red}</p>
            <div class="circle-header red " />
            <p>${this.snapshotData.count_yellow}</p>
            <div class="circle-header yellow " />
            <p>${this.snapshotData.count_green}</p>
            <div class="circle-header green " />
          </div>
      </div>`));

    const keysToPick = _.keys(this.model.attributes.family_data);
    _.forOwn(
       _.forEach(this.model.attributes.family_data, keysToPick),
       (value, key) => {
         headerView.push(`<label>${this.getName(key)}:</label> ${value}`);
      }
    );
    headerView.push(`<hr></hr>`);
     
    return headerView;
  },

  getName(indicator){
    return indicator.replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str){ return str.toUpperCase(); });
  }
});
