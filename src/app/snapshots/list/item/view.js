import Mn from 'backbone.marionette';
import Template from './template.hbs';
import _ from 'lodash';
import moment from 'moment';
import PriorityView from './priority/view';
import datetimepicker from 'eonasdan-bootstrap-datetimepicker';
import $ from 'jquery';
import FlashesService from '../../../flashes/service';
import PriorityModel from './priority/model';
import ModalService from '../../../modal/service';



export default Mn.View.extend({
  template: Template,
  events: {
    'click #circle': 'handlerOnClickIndicator',
    'click #delete': 'handleOnDeletePriority'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
    this.model.on('sync', this.render);
  },

  serializeData() {
    var self = this;
    this.props.model.attributes.indicators_priorities.forEach(value =>{
      var date = self.formartterOnlyDate(value.estimated_date);
      value.estimated_date = date;

    });
    
    return {
      header: {
        date: this.formartterWithTime(this.model.attributes.created_at),
        data: this.model.attributes//,
      },
      data: this.model.attributes.indicators_survey_data.map(value => {
        return {
          clazz: value.value.toLowerCase(),
          value: value.value,
          name: value.name
        }
      }),
      priorities: this.props.model.attributes.indicators_priorities,
      clazz: this.props.model.attributes.indicators_priorities<=0?'hidden':''
    };
  },

  handleOnDeletePriority(event) {
    const toRemoveId = $(event.currentTarget).data('id');
    const model = new PriorityModel();

    model.set({
      id : $(event.currentTarget).data('id')
    });


    ModalService.request('confirm', {
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete this priority?`
    }).then(confirmed => {

      if (!confirmed) {
        return;
      }

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
    });


  },

  formartterWithTime(date) {
    if (!date) {
      return null;
    }
    return moment(date).format('DD/MM/YYYY hh:mm:ss');
  },

  formartterOnlyDate(date){
    if (!date) {
      return null;
    }
    return moment(date, ["YYYY-MM-DD", "DD/MM/YYYY"]).format('DD/MM/YYYY');
  },

  handlerOnClickIndicator(e){
    const indicatorSelected = e.target.parentNode.children['indicator-name'].innerHTML;
    const indicatorSelectedValue = e.target.parentNode.children['indicator-value'].innerHTML;

    var exists = [];

    var self = this;
    exists = this.props.model.attributes.indicators_priorities.filter(priority => {
      return priority.indicator === indicatorSelected;
    });

    if(exists.length>0){
      FlashesService.request('add', {
        type: 'info',
        title: `The "${indicatorSelected}" indicator was previously selected`
      });
      return;
    }

    if(indicatorSelectedValue.toUpperCase()==='GREEN'){
      FlashesService.request('add', {
        type: 'info',
        title: `The "${indicatorSelected}" indicator is really good`
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
