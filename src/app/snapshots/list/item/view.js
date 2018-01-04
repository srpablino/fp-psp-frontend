import Mn from 'backbone.marionette';
import 'eonasdan-bootstrap-datetimepicker';
import Bn from 'backbone';
import $ from 'jquery';
import moment from 'moment';

import Template from './template.hbs';
import PriorityView from './priority/view';
import FlashesService from '../../../flashes/service';
import PriorityModel from './priority/model';
import ModalService from '../../../modal/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #circle': 'handlerOnClickIndicator',
    'click #delete': 'handleOnDeletePriority',
    'click #finish-snapshot': 'handleShowFamilyMap',
    'click #print': 'printSnapshot'
  },

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
    this.model.on('sync', this.render);
  },

  serializeData() {
    var self = this;
    this.props.model.attributes.indicators_priorities.forEach(value => {
      var date = self.formartterOnlyDate(value.estimated_date);
      value.estimated_date = date;
    });

    return {
      header: {
        date: this.formartterWithTime(this.model.attributes.created_at),
        data: this.model.attributes // ,
      },
      data: this.model.attributes.indicators_survey_data.map(value => ({
        clazz: value.value.toLowerCase(),
        value: value.value,
        name: value.name
      })),
      priorities: this.props.model.attributes.indicators_priorities,
      clazz:
        this.props.model.attributes.indicators_priorities <= 0 ? 'hidden' : ''
    };
  },

  handleOnDeletePriority(event) {
    const toRemoveId = $(event.currentTarget).data('id');
    const model = new PriorityModel();

    model.set({
      id: $(event.currentTarget).data('id')
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
        elements = elements.filter(
          priority => priority.snapshot_indicator_priority_id !== toRemoveId
        );
        this.props.model.attributes.indicators_priorities = elements;
        setTimeout(() => {
          this.render();
        }, 300);
      });

      return FlashesService.request('add', {
        timeout: 2000,
        type: 'info',
        title: `The priority has been deleted!`
      });

    });
  },

  formartterWithTime(date) {
    if (!date) {
      return null;
    }
    return moment(date).format('DD/MM/YYYY hh:mm:ss');
  },

  formartterOnlyDate(date) {
    if (!date) {
      return null;
    }
    return moment(date, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('DD/MM/YYYY');
  },

  handlerOnClickIndicator(e) {
    const indicatorSelected =
      e.target.parentNode.children['indicator-name'].innerHTML;
    const indicatorSelectedValue =
      e.target.parentNode.children['indicator-value'].innerHTML;

    var exists = [];

    exists = this.props.model.attributes.indicators_priorities.filter(
      priority => priority.indicator === indicatorSelected
    );

    if (exists.length > 0) {
      return FlashesService.request('add', {
        timeout: 2000,
        type: 'info',
        title: `The "${indicatorSelected}" indicator was previously selected`
      });

    }

    if (indicatorSelectedValue.toUpperCase() === 'GREEN') {
      return FlashesService.request('add', {
        timeout: 2000,
        type: 'info',
        title: `The "${indicatorSelected}" indicator is really good`
      });

    }
    this.showDialogPriority(indicatorSelected);
    this.priorityDialog.open();
    this.priorityDialog.on('change', data => {
      this.props.model.attributes.indicators_priorities.push(data);
      setTimeout(() => {
        this.render();
      }, 300);
      this.priorityDialog.close();
    });
  },

  showDialogPriority(indicator) {
    const dataIdConfirmOperacion = Math.random();

    this.priorityDialog = new PriorityView({
      dataId: dataIdConfirmOperacion,
      indicatorName: indicator,
      snapshotIndicatorId: this.model.attributes.snapshot_indicator_id,
      obj: this
    });

    $('#modal-region').append(this.priorityDialog.render().el);
  },

  handleShowFamilyMap(e) {
    e.preventDefault();
    $('#check-privacity')
    if($('#check-privacity').is(':checked')) {
      console.log("checkeado")
      ModalService.request('alert', {
        title: 'information',
        text: `Your personal information has not been saved in the platform`
      }).then(confirmed => {
        //not save snapshot
        alert("OK")
        // Bn.history.navigate(
        //   `families/${this.props.model.attributes.family_id}/snapshots/${
        //     this.props.model.attributes.snapshot_economic_id
        //   }`,
        //   true
        // );

      });
    } else {
        //save snapshot
        console.log("no checkeado")
    }
    // Bn.history.navigate(
    //   `families/${this.props.model.attributes.family_id}/snapshots/${
    //     this.props.model.attributes.snapshot_economic_id
    //   }`,
    //   true
    // );
  },
  printSnapshot(event) {
    var id = `#${event.target.value}`;
    $(id).printThis({
      loadCSS: ['/css/main.css'],
      importCSS: true,
      debug: false,
      importStyle: true,
      pageTitle: '',
      header: '<h3>Survey Results</h3>',
      footer: null,
      base: false,
      removeScripts: true,
      copyTagClasses: true,
      doctypeString: '<!DOCTYPE html>'
    });
  }
});
