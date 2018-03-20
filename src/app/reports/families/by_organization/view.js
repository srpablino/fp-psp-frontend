import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Collection from './collection';
import CollectionView from './list/view';
import OrganizationModel from '../../../organizations/model'
import utils from '../../../utils';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSearch',
    'keypress #search': 'handleSearch'
  },
  regions: {
    list: '#family-organization-list'
  },
  initialize(options){
    this.app = options.app;
    this.collection = new Collection();
    this.organizationModel = new OrganizationModel();
    this.filters = {
        date_from: '',
        date_to: '',
        organization_id: '',
        family_id:'',
        application_id:''
    }
    this.organizations = {};
  },

  onRender(){
    this.setCalendarToVariable('#dateFrom');
    this.setCalendarToVariable('#dateTo');
    this.obtainOrganizations();

    return this.organizations;
  },

  setCalendarToVariable(varName){

    let $date = this.$el.find(varName);
    $date.datetimepicker({
      format: 'DD/MM/YYYY',
      locale: this.app.getSession().get('locale')?this.app.getSession().get('locale'):'es'
    });
  },

  obtainOrganizations(){
    let self = this;
    this.organizationModel.fetch({
        success(response) {
          self.organizationModel = response.get('list');
          $.each(self.organizationModel, (index, element) => {
            $('#organization').append(
              $('<option></option>')
                .attr('value', element.id)
                .text(element.name)
            );
          });
        }
    });
  },

  handleSearch(event){
    event.preventDefault();
    let self = this;
    if (event.which === 13 || event.which === 1) {

      const container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

      self.collection.reset();
      this.getRegion('list').empty();
      section.loading();

        this.filters.date_from = this.$el.find('#date1').val() === '' ? '' : this.$el.find('#date1').val();
        this.filters.date_to = this.$el.find('#date2').val() === '' ? '' : this.$el.find('#date2').val();
        this.filters.organization_id = this.$el.find('#organization').val()==='all'? '' : this.$el.find('#organization').val();
        this.filters.application_id = this.$el.find('#organization').val()==='all' && this.app.getSession().get('user').application!==null? 
                this.app.getSession().get('user').application.id : '';

        this.collection.fetch({
            data: this.filters,
            success() {
             self.showList();
             section.reset();
            }

        });

       
    }

  },

  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection.models, filters: this.filters })
    );
  },



});