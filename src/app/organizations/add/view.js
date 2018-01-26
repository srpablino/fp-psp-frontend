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
    'click #image-logo': 'selectFile',
    'click #image-logo-text': 'selectFile',
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
      organization: this.model.attributes
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

    const session = this.app.getSession();

    // We manually add form values to model,
    // the form -> model binding should ideally
    // be done automatically.
    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });

    if (session.userHasRole('ROLE_HUB_ADMIN')) {
      let application = session.get('user').application;
      this.model.set('application', application);
    }

    let errors = this.model.validate();

    if (errors) {
      errors.forEach(error => {
        FlashesService.request('add', {
          timeout: 3000,
          type: 'warning',
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
            history.navigate('organizations', {trigger: true});
          })
          .always(() => {
            button.reset();
          });
      };
    } else {
      button.loading();

      storage
        .save(this.model)
        .then(() => {
          button.reset();
          history.navigate('organizations', {trigger: true});
        })
        .always(() => {
          button.reset();
        });
    }
  }
});
