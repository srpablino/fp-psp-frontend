import {history} from 'backbone';
import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Model from '../model';
import storage from '../storage';
import utils from '../../utils';
import RolesModel from '../../roles/model';
import HubsModel from '../../hubs/model';
import PartnersModel from '../../partners/model';
import OrganizationsModel from '../../organizations/model';
import FlashesService from '../../flashes/service';
import env from '../../env';

export default Mn.View.extend({
  template: Template,
  rolesCollection: new RolesModel(),
  hubsCollection: new HubsModel(),
  partnersCollection: new PartnersModel(),
  organizationsCollection: new OrganizationsModel(),
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
  loadRoles() {
    const self = this;
    this.rolesCollection.fetch({
      success(response) {
        self.rolesCollection = response.toJSON();
        $.each(self.rolesCollection, (index, element) => {
          $('#select-role').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.role)
          );
        });
      }
    });
  },
  loadOrgs() {
    const roleSelected = $('#select-role').val();

    if (roleSelected === 'ROLE_HUB_ADMIN') {

      $('#select-org-placeholder').text('Select Hub');
      $('#select-org').val('Select Hub');
      $('#select-org').find('option:not(:first)').remove();

      //  List All Hubs

      const self = this;
      this.hubsCollection = new HubsModel();
      this.hubsCollection.fetch({
        success(response) {
          self.hubsCollection = response.toJSON();
          $.each(self.hubsCollection, (index, element) => {
            $('#select-org').append(
              $('<option></option>')
                .attr('value', element.id)
                .attr('data-type', "application")
                .text(element.name)
            );
          });
        }
      });

    } else if (roleSelected === 'ROLE_APP_ADMIN') {

      //  List Apps for Logged User,
      //    if ROLE_ROOT: all Partners,
      //    if ROLE_HUB_ADMIN: this Hub's organizations

      if (this.app.getSession().userHasRole('ROLE_ROOT')) {
        $('#select-org-placeholder').text('Select Partner');
        $('#select-org').val('Select Partner');
        $('#select-org').find('option:not(:first)').remove();

        //  List All Partners

        const self = this;
        this.partnersCollection = new PartnersModel();
        this.partnersCollection.fetch({
          success(response) {
            self.partnersCollection = response.toJSON();
            $.each(self.partnersCollection, (index, element) => {
              $('#select-org').append(
                $('<option></option>')
                  .attr('value', element.id)
                  .attr('data-type', "application")
                  .text(element.name)
              );
            });
          }
        });
      } else if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
        $('#select-org-placeholder').text('Select Organization');
        $('#select-org').val('Select Organization');
        $('#select-org').find('option:not(:first)').remove();

        //  List this Hub's organizations

        const self = this;
        this.organizationsCollection = new OrganizationsModel();
        this.organizationsCollection.urlRoot = `${env.API}/organizations/organizationsByLoggedUser`;
        this.organizationsCollection.fetch({
          success(response) {
            self.organizationsCollection = response.toJSON();
            $.each(self.organizationsCollection, (index, element) => {
              $('#select-org').append(
                $('<option></option>')
                  .attr('value', element.id)
                  .attr('data-type', "organization")
                  .text(element.name)
              );
            });
          }
        });
      }

    } else if (roleSelected === 'ROLE_USER' || roleSelected === 'ROLE_SURVEY_USER') {

      //  Show Logged User App,
      //    if ROLE_HUB_ADMIN: show logged user Hub,
      //    if ROLE_APP_ADMIN: show logged user Partner

      if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
        $('#select-org-placeholder').text('Select Hub');
        $('#select-org').val('Select Hub');
        $('#select-org').find('option:not(:first)').remove();

        //  Fetch logged user Hub

        const self = this;
        this.hubsCollection = new HubsModel();
        this.hubsCollection.urlRoot = `${env.API}/organizations/organizationByLoggedUser`;
        this.hubsCollection.fetch({
          success(response) {
            self.hubsCollection = response.toJSON();
            $.each(self.hubsCollection, (index, element) => {
              $('#select-org').append(
                $('<option></option>')
                  .text(element.name)
              );
            });
          }
        });
      } else if (this.app.getSession().userHasRole('ROLE_APP_ADMIN')) {
        $('#select-org-placeholder').text('Select Organization');
        $('#select-org').val('Select Organization');
        $('#select-org').find('option:not(:first)').remove();

        //  Fetch logged user App (Organization or Partner)

        const self = this;
        this.organizationsCollection = new OrganizationsModel();
        this.organizationsCollection.urlRoot = `${env.API}/organizations/organizationByLoggedUser`;
        this.organizationsCollection.fetch({
          success(response) {
            self.organizationsCollection = response.toJSON();
            $.each(self.organizationsCollection, (index, element) => {
              $('#select-org').append(
                $('<option></option>')
                  .text(element.name)
              );
            });
          }
        });
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

    storage
      .save(this.model)
      .then(() => {
        button.reset();
        history.navigate('users', { trigger: true });
      })
      .always(() => {
        button.reset();
      });
  }
});
