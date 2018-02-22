import Marionette from 'backbone.marionette';
import $ from 'jquery';
import moment from 'moment';

import Template from './template.hbs';
import PriorityModel from './model';
import PriorityCollection from './collection';
import FlashesService from '../../../../flashes/service';

export default Marionette.View.extend({
  initialize(options) {
    this.options = options;
    this.model = new PriorityModel();
    this.collection = new PriorityCollection();
    this.collection.fetch({
      data: { snapshotIndicatorId: this.options.snapshotIndicatorId }
    });
  },
  template: Template,
  events: {
    'click #add-priority': 'addPriority',
    'click #cancel-priority': 'close',
    'shown.bs.modal': function() {
      this.$el.find('#reason')[0].focus();
    }
  },

  render() {
    this.indicatorPriority = {
      indicator: this.options.indicatorName,
      reason: '',
      action: '',
      estimated_date: ''
    };

    let html = Template();
    this.$el.html(html);
    let title = (this.options && this.options.indicatorName) || '';
    this.$el.find('.title-blue').append(this.options.isSuccess ? `I'm proud of: ${title}` : title);
    this.$el.find('#modal-content').attr('data-id', this.options.dataId);
    let $fecha = this.$el.find('#datetimepicker');
    $fecha.datetimepicker({
      format: 'DD/MM/YYYY',
      minDate: moment(),
      locale: 'en'
    });
    if (this.options.isSuccess) {
      this.$el.find('.forPriority').hide();
      this.$el.find('#reasonTitle').text('Comments');
    }
    return this;
  },

  open() {
    var $modal = $('#modal-region').find(`[data-id='${this.options.dataId}']`);
    $modal.modal('show');
    $modal.modal({ backdrop: 'static', keyboard: false });
  },

  close(e) {
    if (e) {
      e.preventDefault();
    }
    let $modal = $('#modal-region').find(`[data-id='${this.options.dataId}']`);
    $modal.modal('hide');
  },

  addPriority(e) {
    e.preventDefault();
    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.indicatorPriority[element.name] = element.value;
      });
    this.indicatorPriority.estimated_date = this.$el.find('#fecha').val() === '' ? null : this.$el.find('#fecha').val();
    this.indicatorPriority.snapshot_indicator_id = this.options.snapshotIndicatorId;
    this.indicatorPriority.is_success = this.options.isSuccess;


    let errors = this.model.validate(this.indicatorPriority);

    if (errors) {
      errors.forEach(error => {
        FlashesService.request('add', {
          timeout: 2000,
          type: 'warning',
          title: error
        });
      });
    } else {
      this.model.save(this.indicatorPriority).then(
        model => {
          this.trigger('change', model);
          FlashesService.request('add', {
            timeout: 2000,
            type: 'info',
            title: 'The information has been saved'
          });
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
  }
});
