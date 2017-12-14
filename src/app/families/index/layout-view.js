import Mn from 'backbone.marionette';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import utils from '../../utils';
import storage from '../storage';
import FamiliesModel from '../model';
import $ from 'jquery';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit'
  },
  initialize() {
    this.collection = new Backbone.Collection();
    this.collection.on('remove', this.render);
  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  handleSubmit(event) {
    var organization_id = $("#organization").val();
    var country_id = $("#country").val();
    var city_id = $("#city").val();
    var free_text = $("#search").val();
    var self = this;
    let container = this.$el.find('.list-container').eq(0);
    const section = utils.getLoadingSection(container);

    if(organization_id != null && country_id != null && city_id != null ){
      self.collection.reset();
      this.getRegion('list').empty();
      section.loading();


        var params = {
          organization_id: $("#organization").val(),
          country_id: $("#country").val(),
          city_id: $("#city").val(),
          free_text: $("#search").val()
        };

        var elements = new FamiliesModel();
        console.log(params)
        elements.fetch({
          data: params,
          success:function(response){
            console.log(response.toJSON())

            self.collection.add(response.get('list'));

          }
        });
        self.showList();
    }else{
      alert("Seleccione")
    }




  }
});
