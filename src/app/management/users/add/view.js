import Bn from 'backbone';
import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Model from '../model';
import userStorage from '../storage';
import utils from '../../../utils';
import FlashesService from '../../../flashes/service';
import env from '../../../env';
import storage from '../../storage';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSubmit',
    'change #select-app': 'loadRoles',
    'change #select-org': 'loadRoles'
  },
  initialize(options) {
    this.app = options.app;
    this.model = new Model();
    if (options.model){
      this.model.attributes = this.options.model.attributes;
    }else{
      this.model.urlRoot = `${env.API}/users/addUserRoleApplication`;
    }

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
  onAttach() {
    this.loadOrgs();
  },
  loadOrgs() {
    const session = this.app.getSession();

    if (session.userHasRole('ROLE_ROOT')) {
      //  List all applications (Hubs and Partners)
      this.genericFetch(
        '/applications/hubsandpartners',
        '#select-app',
        t('user.form.select-hub'),
        'application',
        'name'
      );
    } else if (session.userHasRole('ROLE_HUB_ADMIN')) {
      //  List this Hub's organizations
      let hubId = session.get('user').application.id;
      this.genericFetch(
        `/applications/${hubId}/organizations`,
        '#select-org',
        t('user.form.select-organization'),
        'organization',
        'name'
      );
    } else if (session.userHasRole('ROLE_APP_ADMIN')) {
      this.loadRoles();
    }
  },
  loadRoles() {
    const session = this.app.getSession();

    var roles = [];
    if (session.userHasRole('ROLE_ROOT')) {
      const appSelected = $('#select-app').find(":selected");

      if (appSelected.attr('data-type') === 'hub') {
        roles.push({role: "ROLE_HUB_ADMIN"});
      } else if (appSelected.attr('data-type') === 'partner') {
        roles.push({role: "ROLE_APP_ADMIN"});
      }
    } else if (session.userHasRole('ROLE_HUB_ADMIN')) {
      roles.push({role: "ROLE_APP_ADMIN"});
    } else if (session.userHasRole('ROLE_APP_ADMIN')) {
      roles.push({role: "ROLE_USER"});
      roles.push({role: "ROLE_SURVEY_USER"});
    }

    this.loadSelect(
      roles,
      '#select-role',
      t('user.form.select-role'),
      'role',
      'role'
    );
  },
  genericFetch(path, selectId, placeholder, type, fieldDisplayed) {
    const self = this;
    var modelCollection = new Bn.Model();
    modelCollection.urlRoot = `${env.API}${path}`;
    modelCollection.fetch({
      success(response) {
        var list = response.toJSON().list || response.toJSON();
        self.loadSelect(list, selectId, placeholder, type, fieldDisplayed);
      }
    });
  },
  loadSelect(list, selectId, placeholder, type, fieldDisplayed) {
    $(`${selectId}`).show();
    $(`${selectId}-placeholder`).text(`* ${placeholder}`);
    $(selectId).val(`* ${placeholder}`);
    $(selectId)
      .find('option:not(:first)')
      .remove();

    $.each(list, (index, element) => {
      var dataType = type;
      if (dataType === 'application')
        if (element.hub)
          dataType = 'hub';
        else if (element.partner)
          dataType = 'partner';

      $(selectId).append(
        $('<option></option>')
          .attr('value', element.id)
          .attr('data-type', dataType)
          .text(element[fieldDisplayed])
      );
    });
  },
  handleSubmit(event) {
    event.preventDefault();
    const button = utils.getLoadingButton(this.$el.find('#submit'));
    const session = this.app.getSession();

    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.model.set(element.name, element.value);
      });

    if (session.userHasRole('ROLE_APP_ADMIN')) {
        let user = session.get('user');
        this.model.set('application', user.application && user.application.id);
        this.model.set('organization', user.organization && user.organization.id);
    }

    let errors = this.model.validate();

    if (errors) {
      this.model.fetch();
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
          title: t('user.form.add-success')
        });
      })
      .catch(response => {
        this.model.fetch();
        if (response.status === 400) {
          FlashesService.request('add', {
            timeout: 3000,
            type: 'danger',
            title: t('user.form.add-failed')
          });
        }
        button.reset();
      });
  }
});
