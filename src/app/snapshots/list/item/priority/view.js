import Marionette from 'backbone.marionette';
import Template from './template.hbs';
import PriorityModel from './model';
import PriorityCollection from './collection';
import _ from 'lodash';
import datetimepicker from 'eonasdan-bootstrap-datetimepicker';
import $ from 'jquery';

export default Marionette.View.extend({
    initialize(options){
      this.options=options;
      this.model = new PriorityModel();
      this.collection = new PriorityCollection();
  
      this.collection.fetch({
        data: { snapshotIndicatorId: this.options.snapshotIndicatorId}
      });
  
    },
    template: Template,
    events:{
        'click #add-priority':'addPriority',
        'click #cancel-priority':'close'

    },
    render(){

        this.indicatorPriority={};
        this.indicatorPriority.indicator = this.options.indicatorName;
        this.indicatorPriority.reason = '';
        this.indicatorPriority.action = '';
        this.indicatorPriority.estimated_date = null;

        var html=Template();
        this.$el.html(html);
        var title = (this.options&&this.options.indicatorName)||"";
        this.$el.find('.title-blue').append(title);
        this.$el.find("#modal-content").attr('data-id', this.options.dataId);
        var $fecha = this.$el.find('#datetimepicker1');
        $fecha.datetimepicker({locale:'es', format:"DD/MM/YYYY" });
        return this;
    },

    actionModal(e){
        e.preventDefault();
        this.trigger("modalConfirmAction");
    },

    open(){
      var $modal = $('#modal-region').find("[data-id='" + this.options.dataId + "']");
      $modal.modal("show");
      $modal.modal({backdrop: 'static', keyboard: false});
    },

    close(e){
      if (e) {
        e.preventDefault();
      }
      var $modal = $('#modal-region').find("[data-id='" + this.options.dataId + "']");
      $modal.modal("hide");
    },

    addPriority(e){

        e.preventDefault();
        this.$el
            .find('#form')
            .serializeArray()
            .forEach(element => {
                this.indicatorPriority[element.name] = element.value;
              });
            this.indicatorPriority.estimated_date = this.$el.find('#fecha').val();
            this.indicatorPriority.snapshot_indicator_id = this.options.snapshotIndicatorId;
          
        var self = this;

        this.model.save(this.indicatorPriority).then( function (){
          //self.model.on('sync', self.render);
          self.model.fetch({
            data: { snapshotIndicatorId: self.options.snapshotIndicatorId}
          });
        
          self.close();
        });
    }
});