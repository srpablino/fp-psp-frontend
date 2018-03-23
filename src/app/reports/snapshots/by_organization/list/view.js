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
    'click #export':'generateCsv'
  },
  regions: {
  },

  initialize(options){
    this.collection = options.collection;
    this.filters = options.filters;
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

  generateCsv(event){
    event.preventDefault();
    let csvModel = new CsvModel();


    csvModel.fetch({
      data: this.filters,
      dataType: 'text',
      success(response, model) {
        const blob = new Blob([model]);
          if (window.navigator.msSaveOrOpenBlob)  
              window.navigator.msSaveBlob(blob, "snapshots.csv");
          else
          {
              const a = window.document.createElement("a");
              a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
              a.download = "snapshots.csv";
              document.body.appendChild(a);
              a.click(); 
              document.body.removeChild(a);
          }
        }
      
    }) ;
  }
});