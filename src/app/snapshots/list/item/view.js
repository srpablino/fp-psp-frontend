import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _ from 'lodash';
import moment from 'moment';
import PriorityView from './priority/view';
import datetimepicker from 'eonasdan-bootstrap-datetimepicker';
import $ from 'jquery';
import FlashesService from '../../../flashes/service';
import PriorityModel from './priority/model';


export default Mn.View.extend({
  template: Template,
  events: {
    'click #circle': 'handlerOnClickIndicator',
    'click .btn-danger': 'handleOnDeletePriority'
    
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
    this.model.on('sync', this.render);
    
  },

  serializeData() {
    console.log(this.props.model.attributes.indicators_priorities)
    return {
      header: {
        date: this.getCreatedAt(),
        data: this.model.attributes,
        extra: this.createHeaderRepresentation()
      },
      data: this.model.attributes.indicators_survey_data.map(value => {
        return {
          clazz: value.value.toLowerCase(),
          value: value.value,
          name: value.name
        }
      }),
      priorities: this.props.model.attributes.indicators_priorities
    };
  },

  handleOnDeletePriority(event) {
    const toRemoveId = $(event.currentTarget).data('id');
    const model = new PriorityModel();

    model.set({
      id : $(event.currentTarget).data('id')
    });
    model.destroy().then(() => {
      
      var elements = this.props.model.attributes.indicators_priorities;
      elements = elements.filter(priority => {
        return priority.snapshot_indicator_priority_id !== toRemoveId;
      });
      this.props.model.attributes.indicators_priorities = elements;
      setTimeout(() => {
        this.render();  
      }, 300);
    });
    
    /*.remove(
      {
        snapshotIndicatorId : $(event.currentTarget).data('id')
      }
    );*/
  },


  createHeaderRepresentation(){
    var headerExtra = [];
    
    const keysToPick = _.keys(this.model.attributes.family_data);
    _.forOwn(
       _.forEach(this.model.attributes.family_data, keysToPick),
       (value, key) => {
        headerExtra.push({
          label: key,
          value: value
        });
      }
    );
     
    return headerExtra;
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

      FlashesService.request('add', {
        type: 'danger',
        title: 'No se puede agregar cosas al verde'
      });
      return;
    }
    this.showDialogPriority(indicatorSelected);
    this.priorityDialog.open();
    this.priorityDialog.on('change', data => {
      this.props.model.attributes.indicators_priorities.push(data);
      setTimeout(() => {
        this.render();  
      }, 300);
      this.priorityDialog.close();
    })

    
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
  }

});
