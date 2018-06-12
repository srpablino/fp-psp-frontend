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
        url: `${env.API}/labels/list`,
        data(params) {
          let query = {
            label: params.term
          }
          return query;
        },
        processResults(data) {
          let results = [];
          for(let i=0;i<data.length;i++){
            let item = data[i];
            item.text=item.description;
            results.push(item);
          }
          return {
            results
          };
        }
      },
      createTag(params) {
        let term = $.trim(params.term);
        if (term === '') {
          return null;
        }
        return {
          id: term,
          text: term
        }
      },
      insertTag(data, labelItem) {
        data.push(labelItem);
      }
    }).on("select2:select",
      (e) => {
        if (e) e.preventDefault();
        self.labelsSelected = self.labelSelector.val();
        const results = self.labelsSelected
          .filter(label => Number.isNaN(label));
        if (!self.toFilter &&
          results.length > 0) {
          self.createLabel(results[0]);
        }
      }).on("select2:unselect",
      (e) => {
        if (e) e.preventDefault();
        self.labelsSelected = self.labelSelector.val();
      });
  },
  createLabel(label) {
    let self = this;
    this.model.set('code', label);
    this.model.set('description', label);
    this.model.save({}, {
      success(model, response) {
        let id = response.id;
        let filters = [];
        for(let i=0;i<self.labelsSelected;i++){
          let labelItem = self.labelsSelected[i];
          if(Number.isNaN(self.labelsSelected[i])) {
            labelItem = id;
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
