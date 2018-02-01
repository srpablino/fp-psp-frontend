import Mn from 'backbone.marionette';
import { history } from 'backbone';
import Template from './template.hbs';
import Model from '../model';
import storage from '../storage';
import utils from '../../utils';
import FlashesService from '../../flashes/service';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .select-file': 'selectFile',
    'change #input-image-file': 'previewFile',
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.app = options.app;
    this.props = Object.assign({}, options);
    this.model = this.props.model || new Model();
  },
  serializeData() {
    return {
      application: this.model.attributes
    };
  },
  selectFile() {
    this.$el.find('#input-image-file').click();
  },
  previewFile() {
    var reader = new FileReader();
    let logoImage = this.$el.find('#image-logo');
    reader.onload = function () {
      logoImage.attr('src', reader.result);
    };
    reader.readAsDataURL(this.$el.find('#input-image-file').prop('files')[0]);
  },
  handleSubmit(event) {
    event.preventDefault();
    const button = utils.getLoadingButton(this.$el.find('#submit'));

    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });

    let errors = this.model.validate();

    if (errors) {
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

    let file = this.$el.find('#input-image-file').prop('files')[0];
    if (file !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        var fileBase64 = reader.result;
        this.model.set('file', fileBase64);

        button.loading();

        storage
          .save(this.model)
          .then(() => {
            button.reset();
            history.navigate('applications', {trigger: true});
            FlashesService.request('add', {
              timeout: 3000,
              type: 'info',
              title: "Hub created successfully"
            });
          })
          .catch(response => {
            if (response.status === 400) {
              FlashesService.request('add', {
                timeout: 3000,
                type: 'danger',
                title: response.responseJSON.message
              });
            }
            button.reset();
          });
      };
    } else {
      button.loading();

      storage
        .save(this.model)
        .then(() => {
          button.reset();
          history.navigate('applications', {trigger: true});
          FlashesService.request('add', {
            timeout: 3000,
            type: 'info',
            title: "Hub created successfully"
          });
        })
        .catch(response => {
          if (response.status === 400) {
            FlashesService.request('add', {
              timeout: 3000,
              type: 'danger',
              title: response.responseJSON.message
            });
          }
          button.reset();
        });
    }
  }
});
