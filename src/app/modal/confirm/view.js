import {View} from 'backbone.marionette';
import {Model} from 'backbone';
import template from './template.hbs';

export default View.extend({
  template: template,

  initialize(options = {}) {
    this.model = new Model(options);
  },

  triggers: {
    'click .btn-primary' : 'confirm',
    'click .btn-default' : 'cancel',
    'click .close'       : 'cancel'
  }
});
