import Mn from 'backbone.marionette';
import $ from 'jquery';
import {history} from 'backbone';
import Template from './template.hbs';
import Model from '../model';
import storage from '../storage';
import utils from '../../../utils';
import FlashesService from '../../../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .select-file': 'selectFile',
    'change #input-image-file': 'previewFile',
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.app = options.app;
    this.model = options.model || new Model();
  },
  serializeData() {
    return {
      application: this.model.attributes,
      isNew: this.model.get('id') === undefined,
      logoImage: this.model.get('logoUrl') || '/static/images/icon_camara.png'
    };
  },
  onRender() {
    let headerItems;
    if(this.app.getSession().userHasRole('ROLE_ROOT')){
      headerItems = storage.getUserSubHeaderItems();
    }else{
      headerItems = storage.getSubHeaderItems();
    }
    this.app.updateSubHeader(headerItems)
    $('a[href$="management/applications"]')
      .parent()
      .addClass('subActive');

  },
  selectFile() {
    this.$el.find('#input-image-file').click();
  },
  previewFile() {
    var self = this;
    var reader = new FileReader();
    let logoImage = this.$el.find('#image-logo');
    reader.onload = () => {
      self.file = reader.result;
      logoImage.attr('src', self.file);
    };
    reader.readAsDataURL(this.$el.find('#input-image-file').prop('files')[0]);
  },
  handleSubmit(event) {
    let isNew = this.model.get('id') === undefined;
    event.preventDefault();
    const button = utils.getLoadingButton(this.$el.find('#submit'));

    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });
    this.model.set('file', this.file);

    let errors = this.model.validate();

    if (errors) {
      if (!isNew){
        this.model.fetch();
      }
      errors.forEach(error => {
        FlashesService.request('add', {
          timeout: 3000,
          type: 'danger',
          title: error
        });
      });
      button.reset();
      return;
    }

    button.loading();

    storage
      .save(this.model)
      .then(() => {
        button.reset();
        history.navigate('management/applications', {trigger: true});
        FlashesService.request('add', {
          timeout: 3000,
          type: 'info',
          title: t('hub.save.success')
        });
      })
      .catch(response => {
        if (!isNew){
          this.model.fetch();
        }
        if (response.status === 400) {
          FlashesService.request('add', {
            timeout: 3000,
            type: 'danger',
            title: t('hub.save.failed')
          });
        }
        button.reset();
      });
  }
});
