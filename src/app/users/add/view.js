import Backbone from 'backbone';
import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Model from '../model';
import storage from '../storage';
import utils from '../../utils';
import FlashesService from '../../flashes/service';
import env from '../../env';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSubmit',
    'change #select-role': 'loadOrgs'
  },
  initialize(options) {
    this.app = options.app;
    this.props = Object.assign({}, options);
    this.model = this.props.model || new Model();
  },
  serializeData() {
    return {
      user: this.model.attributes
    };
  },
  onRender() {
    this.loadRoles();
  },
  loadSelect(list, selectId, placeholder, type, field) {
    $(`${selectId}-placeholder`).text(placeholder);
    $(selectId).val(placeholder);
    $(selectId).find('option:not(:first)').remove();

    $.each(list, (index, element) => {
      $(selectId).append(
        $('<option></option>')
          .attr('value', element.id)
          .attr('data-type', type)
          .text(element[field])
      );
    });
  },
  genericFetch(path, selectId, placeholder, type, field) {
    const self = this;
    var modelCollection = new Backbone.Model();
    modelCollection.urlRoot = `${env.API}${path}`;
    modelCollection.fetch({
      success(response) {
        var list = response.toJSON();
        self.loadSelect(list, selectId, placeholder, type, field);
      }
    });
  },
  loadRoles() {
    this.genericFetch('/user-roles/assignableRolesByUser', '#select-role', 'Select Role', 'role', 'role');
  },
  loadOrgs() {
    const roleSelected = $('#select-role').val();

    if (roleSelected === 'ROLE_HUB_ADMIN') {

      //  List All Hubs
      this.genericFetch('/applications/hubs', '#select-org', 'Select Hub', 'application', 'name');

    } else if (roleSelected === 'ROLE_APP_ADMIN') {

      //  List Apps for Logged Admin User,
      //    if ROLE_ROOT: all Partners,
      //    if ROLE_HUB_ADMIN: this Hub's organizations

      if (this.app.getSession().userHasRole('ROLE_ROOT')) {

        //  List All Partners
        this.genericFetch('/applications/partners', '#select-org', 'Select Partner', 'application', 'name');

      } else if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {

        //  List this Hub's organizations
        let hubId = this.app.getSession().get('user').application.id;
        this.genericFetch(`/applications/${hubId}/organizations`, '#select-org', 'Select Organization', 'organization', 'name');

      }

    } else if (roleSelected === 'ROLE_USER' || roleSelected === 'ROLE_SURVEY_USER') {

      //  Show Logged Admin User App,
      //    if ROLE_HUB_ADMIN: show logged admin user Hub,
      //    if ROLE_APP_ADMIN: show logged user Partner

      if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {

        //  Get logged admin user Hub
        let userHub = this.app.getSession().get('user').application;
        let list = [];
        list.push(userHub);

        this.loadSelect(list, '#select-org', 'Select Hub', 'application', 'name');

      } else if (this.app.getSession().userHasRole('ROLE_APP_ADMIN')) {

        //  Get logged admin user App (Organization or Partner)

        if (this.app.getSession().get('user').organization !== null) {
          let userOrganization = this.app.getSession().get('user').organization;
          let list = [];
          list.push(userOrganization);

          this.loadSelect(list, '#select-org', 'Select Organization', 'organization', 'name');
        } else if (this.app.getSession().get('user').application !== null) {
          let userPartner = this.app.getSession().get('user').application;
          let list = [];
          list.push(userPartner);

          this.loadSelect(list, '#select-org', 'Select Partner', 'application', 'name');
        }
      }
    }
  },
  handleSubmit(event) {
    event.preventDefault();
    const button = utils.getLoadingButton(this.$el.find('#submit'));

    this.user = {};
    this.$el
      .find('#form')
      .serializeArray()
      .forEach(element => {
        this.user[element.name] = element.value;
      });
    this.model.set('user', this.user);

    let roleSelected = $('#select-role').val();
    this.model.set('role', roleSelected);

    let optionSelected = $('#select-org').find(":selected");

    if (optionSelected.attr('data-type') === "application"){
      let application = {};
      application.id = optionSelected.val();
      this.model.set('application', application);
    }

    if (optionSelected.attr('data-type') === "organization"){
      let organization = {};
      organization.id = optionSelected.val();
      this.model.set('organization', organization);
    }

    let errors = this.model.validate(this.model.attributes);

    if (errors) {
      errors.forEach(error => {
        FlashesService.request('add', {
          timeout: 2000,
          type: 'warning',
          title: error
        });
      });
      button.reset();
      return;
    }

    button.loading();

    this.model.urlRoot = `${env.API}/users/addUserRoleApplication`;
    storage
      .save(this.model)
      .then(() => {
        button.reset();
        Backbone.history.navigate('users', { trigger: true });
      })
      .always(() => {
        button.reset();
      });
  }
});
