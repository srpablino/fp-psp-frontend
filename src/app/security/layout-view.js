import Mn from 'backbone.marionette';
import $ from 'jquery';
import Bn from 'backbone';
import Template from './layout-template.hbs';
import utils from '../utils';
import FamiliesColecction from '../families/collection';
import OrganizationsModel from '../organizations/model';
import CitiesModel from '../cities/model';
import CountiesModel from '../countries/model';
import FamiliesModel from '../families/model';

import ModalService from '../modal/service';
import FlashesService from '../flashes/service';
import ItemView from './item/view';



export default Mn.View.extend({
  template: Template,
  collection:  new Bn.Collection(),
  citiesCollection: new CitiesModel(),
  countiesCollection: new CountiesModel(),
  organizationsCollection: new OrganizationsModel(),
  familiesModel: new FamiliesModel(),
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit',
    'keypress #search': 'handleSubmit'
  },
  initialize(options) {
    this.app = options.app;
    this.collection.on('sync', this.render);
    this.collection.on('remove', this.render);



  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
    let self = this;
    console.log(this.app)

    this.citiesCollection.fetch({
      success(response) {
        self.citiesCollection = response.toJSON();
        $.each(self.citiesCollection, (index, element) => {
          $('#city').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.city)
          );
        });
      }
    });

    this.countiesCollection.fetch({
      success(response) {
        self.countiesCollection = response.toJSON();
        $.each(self.countiesCollection, (index, element) => {
          $('#country').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.country)
          );
        });
      }
    });

    this.organizationsCollection.fetch({
      success(response) {
        self.organizationsCollection = response.get('list');
        $.each(self.organizationsCollection, (index, element) => {
          $('#organization').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.name)
          );
        });

        if ( self.app.getSession().userHasRole('ROLE_APP_ADMIN') ) {
          $('#organization').attr('disabled', 'true');
          $('#organization').val(self.app.getSession().get('user').organization.id);
        }
      }
    });
  },
  showList() {

    let element = this.$el.find('#family-list');
    element.empty();

    this.collection.forEach(item => {

      let itemView = new ItemView({
        model: item,
        deleteFamily: this.deleteFamily.bind(this),
        itemViewOptions: {
          className: "col-md-4 col-xs-6"
        },
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });

  },
  handleSubmit(event) {
    if (event.which === 13 || event.which === 1) {

      let self = this;
      let container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

      self.collection.reset();
      this.getRegion('list').empty();
      section.loading();

      let params = {
        organizationId: $('#organization').val(),
        countryId: $('#country').val(),
        cityId: $('#city').val(),
        freeText: $('#search').val()
      };

      let elements = new FamiliesColecction();
      elements.fetch({
        data: params,
        success(response) {
          self.collection = response;
          self.showList();
          section.reset();
        }
      });
    }
  },

  deleteFamily(model) {
    let self = this;
    ModalService.request('confirm', {
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete all the information about the "${model.get('code')}" family?\n\n
       Once you have deleted you will not able to go Cancel`
    }).then(confirmed => {
      if (!confirmed) {
        return;
      }

      model.set("id", model.get('familyId'));
      model.destroy({
          success: () => self.handleDestroySuccess(),
          error: (item, response) =>  self.handleDestroyError(response),
          wait:true
        });
    });
  },
  handleDestroySuccess() {
    this.showList();
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'info',
      body: 'The family has been deleted!'
    });
  },

  handleDestroyError(error) {
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'danger',
      body: error.responseJSON? error.responseJSON.message : "Error"
    });
  }


});
