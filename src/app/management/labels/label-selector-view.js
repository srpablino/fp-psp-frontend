import Mn from 'backbone.marionette';
import 'select2';
import $ from 'jquery';
import Template from './template.hbs';
import LabelModel from './model';
import env from '../../env';


export default Mn.View.extend({
  template: Template,
  initialize(options) {
    this.app = options.app;
    this.toFilter = options.toFilter;
    this.labelsSelected = [];
    this.model = new LabelModel();
  },
  onRender() {
    let self = this;
    this.labelSelector = this.$el.find('.label-selector');
    this.labelSelector.select2({
      language: "es",
      placeholder: "Select a state",
      tags: true,
      multiple: "multiple",
      tokenSeparators: [',', ' '],
      ajax: {
        delay: 500,
        url: `${env.API}/labels/list`,
        data: this.buildDataParam,
        processResults:this.processLabelResults
      },
      createTag:this.addLabelToComponent,
      insertTag: this.insertLabelToComponent
    }).on("select2:select", (e) => {
      self.onSelectLabelEvent(e);
    })
    .on("select2:unselect", (e) => {
        self.onUnSelectLabelEvent(e);
    });
  },
  buildDataParam(params) {
    let query = {
      desc: params.term
    }
    return query;
  },
  onSelectLabelEvent(e) {
    if (e) e.preventDefault();
    this.labelsSelected = this.labelSelector.val();
    let results = [];
    for(let i=0;i<this.labelsSelected.length;i++){
      if(this.labelsSelected[i].length>0 &&
        !$.isNumeric(this.labelsSelected[i])){
        results.push(this.labelsSelected[i]);
      }
    }
    if (!this.toFilter &&
      results.length > 0) {
      this.createLabel(results[0]);
    }
  },
  onUnSelectLabelEvent(e) {
    if (e) e.preventDefault();
    this.labelsSelected = this.labelSelector.val();
  },
  insertLabelToComponent(data, labelItem) {
    data.push(labelItem);
  },
  processLabelResults(data) {
    let results = [];
    for(let i=0;i<data.length;i++){
      let item = data[i];
      item.text=item.description;
      results.push(item);
    }
    return {
      results
    };
  },
  addLabelToComponent(params) {
    let term = $.trim(params.term);
    if (term === '') {
      return null;
    }
    return {
      id: term,
      text: term
    }
  },
  createLabel(label) {
    let self = this;
    this.model.set('code', label);
    this.model.set('description', label);
    this.model.save({}, {
      success(model, response) {
        let filters = [];
        for(let i=0;i<self.labelsSelected.length;i++){
          let labelItem = self.labelsSelected[i];
          if(!$.isNumeric(self.labelsSelected[i])) {
            labelItem = response.id;
          }
          filters.push(labelItem);
        }
        self.labelsSelected = filters;
        self.model.clear();
      }
    });
  },
  setLabels(labels) {
    if(labels && labels.length>0){
      this.labelsSelected=[];
      for(let i=0;i<labels.length;i++){
        let option = new Option(
          labels[i].description,
          labels[i].id,
          true,
          true
        );
        this.labelSelector.append(option);
        this.labelsSelected.push(labels[i].id);
      }
      this.labelSelector.trigger('change');
    }
  },
  getLabelsSelected() {
    return this.labelsSelected;
  }
});
