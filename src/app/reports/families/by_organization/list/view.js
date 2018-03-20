import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Model from './model';
import ItemView from './item/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #family-organization-items .panel-heading': 'familySelected'
  },
  regions: {
    list: '#family-snapshot-items'
  },

  initialize(options){
    this.collection = options.collection;
    this.filters = options.filters;
    this.model = new Model();

  },

  serializeData() {
    return {
      organizations: this.collection
    };
  },

  familySelected(event){
    event.preventDefault();
    let self = this;
    let familyId = $(event.currentTarget).attr('data-target').replace('#', '');
    this.filters.family_id = familyId;
    this.model
      .fetch({
        data: this.filters,
        success() {
          self.showList();
        }
      });
     
  },

  showList() {
    this.getRegion('list').show(
      new ItemView({model: this.model})
    );
  },
});