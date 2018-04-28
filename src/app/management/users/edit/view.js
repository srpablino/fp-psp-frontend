import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Model from './model';
import userStorage from './storage';
import utils from '../../../utils';
import FlashesService from '../../../flashes/service';
import storage from '../../storage';


export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.app = options.app;
    this.model = new Model();
    this.model.attributes = this.options.model.attributes;
  },
  serializeData() {
    return {
      user: this.model.attributes,
      isChecked: this.model.attributes.active,
      isNew: this.model.get('id') === undefined
    };
  },
  onRender() {
    let headerItems;
    if(this.app.getSession().userHasRole('ROLE_ROOT')){
      headerItems = storage.getUserSubHeaderItems();
    }else if(this.app.getSession().userHasRole('ROLE_APP_ADMIN')){
      headerItems={};
      let user = this.app.getSession().get('user');
      this.$el.find('#cancel').attr('href', `#organizations/${user.organization.id}/users`);
    }else{
      headerItems = storage.getSubHeaderItems();
    }
    this.app.updateSubHeader(headerItems);
  },
  handleSubmit(event) {
    event.preventDefault();
    const button = utils.getLoadingButton(this.$el.find('#submit'));
    const session = this.app.getSession();

    this.$el
      .find('#formedit')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });
    this.model.set('active',this.model.get('active')==="on");

    // let errors = this.model.validate();
    let errors = this.model.validate();

    if (errors) {
      errors.forEach(error => {
        this.model.fetch();
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
    userStorage
      .save(this.model)
      .then(() => {
        button.reset();
        if (session.userHasRole('ROLE_APP_ADMIN')) {
          let user = session.get('user');
          let url = `organizations/${user.organization.id}/users`;
          Bn.history.navigate(url, { trigger: true });
        }else{
          Bn.history.navigate('management/users', { trigger: true });
        }

        FlashesService.request('add', {
          timeout: 3000,
          type: 'info',
          title: t('user.formedit.add-success')
        });
      }).catch(response => {
      this.model.fetch();
      if (response.status === 400) {
        FlashesService.request('add', {
          timeout: 3000,
          type: 'danger',
          title: t('user.formedit.add-failed')
        });
      }
      button.reset();

    });
  }
});
