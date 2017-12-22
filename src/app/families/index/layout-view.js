import Mn from 'backbone.marionette';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import utils from '../../utils';
import storage from '../storage';
import FamiliesColecction from '../collection';
import OrganizationsModel from '../../organizations/model';
import CitiesModel from '../../cities/model';
import CountiesModel from '../../countries/model';
import $ from 'jquery';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  citiesCollection: new CitiesModel(),
  countiesCollection: new CountiesModel(),
  organizationsCollection: new OrganizationsModel(),
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit',
    'keypress #search': 'handleSubmit'
  },
  initialize() {
    this.collection = new Backbone.Collection();


  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
    var self = this;

    this.citiesCollection.fetch({
      success:function(response){
        self.citiesCollection =response.toJSON();
        $.each(self.citiesCollection, function(index, element) {
         $('#city')
             .append($("<option></option>")
             .attr("value", element.id)
             .text(element.city));
           })
      }
    });

    this.countiesCollection.fetch({
      success:function(response){
        self.countiesCollection =response.toJSON();
        $.each(self.countiesCollection, function(index, element) {
         $('#country')
             .append($("<option></option>")
             .attr("value", element.id)
             .text(element.country));
           })
      }
    });

    this.organizationsCollection.fetch({
      success:function(response){
        self.organizationsCollection =response.get('list');
        $.each(self.organizationsCollection, function(index, element) {
         $('#organization')
             .append($("<option></option>")
             .attr("value", element.id)
             .text(element.name));
           })
      }
    });


  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  handleSubmit(event) {
    console.log(event.which)
    if(event.which == 13|| event.which == 1){
      var organization_id = $("#organization").val();
      var country_id = $("#country").val();
      var city_id = $("#city").val();
      var free_text = $("#search").val();
      var self = this;
      let container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

    //  if(organization_id != null && country_id != null && city_id != null ){
        self.collection.reset();
        this.getRegion('list').empty();
        section.loading();


          var params = {
            organization_id: $("#organization").val(),
            country_id: $("#country").val(),
            city_id: $("#city").val(),
            free_text: $("#search").val()
          };

          var elements = new FamiliesColecction();
          elements.fetch({
            data: params,
            success:function(response){
              self.collection =response ;
              self.showList();
              section.reset();


            }
          });

    //  }else{
    //    alert("Choose an option")
    //  }
    }

  }
});
