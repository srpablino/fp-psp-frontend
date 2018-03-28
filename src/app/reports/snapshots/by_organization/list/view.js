import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import Model from './model';
import ItemView from './item/view';
import CsvModel from './csv/model';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #family-organization-items .panel-heading': 'familySelected',
    'click #export':'downloadCsv'
  },
  regions: {
  },

  initialize(options){
    this.collection = options.collection;
    this.filters = options.filters;
    this.csvModel = new CsvModel();
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
    const regionName = `list-${familyId}`;

    if (!this.hasRegion(regionName)) 
      this.addRegion(regionName, `#family-snapshot-items-${familyId}`);

    let model = new Model();
    model
      .fetch({
        data: this.filters,
        success() {
          self.showList(regionName, model);
        }
      });
     
  },

  showList(regionName, model) {
    this.getRegion(regionName).show(
      new ItemView({model})
    );
  },

  downloadCsv(event){
    event.preventDefault();
    const a = window.document.createElement("a");
    a.href = `${this.csvModel.urlRoot}?${$.param(this.filters)}`;
    document.body.appendChild(a);
    a.click(); 
    document.body.removeChild(a);
  }
});