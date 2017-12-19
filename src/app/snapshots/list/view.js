import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotCollection from './collection';
import SnapshotItem from './item/view';
import $ from 'jquery';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #new-snapshot': 'newSnapshot',
    'click #print': 'printSnapshot'
  },
  initialize(options) {
    const { handleNewSnapshot, surveyModel } = options;
    this.props = {};
    this.props.handleNewSnapshot = handleNewSnapshot;
    this.props.surveyModel = surveyModel;

    this.collection = new SnapshotCollection();
    this.collection.on('sync', this.render);
    this.collection.fetch({
      data: { survey_id: this.props.surveyModel.get('id') }
    });
  },
  onRender() {
    const list = this.$el.find('#snapshots-list');
    list.empty();
    this.collection.each(model => {
      const item = new SnapshotItem({ model });
      list.append(item.render().el);
    });
  },
  serializeData() {
    return {
      surveyTitle: this.props.surveyModel.get('title')
    };
  },
  newSnapshot() {
    const surveyId = this.$el.find('#survey-id').val();
    this.props.handleNewSnapshot(surveyId);
  },
  printSnapshot(event) {
    var id = "#" + event.target.value
    $(id).printThis({
       loadCSS: ["/css/main.css"],
       importCSS: true,
       debug: false,
		   importStyle: true,
		   pageTitle: "",
		   header: "<h3>Survey Results</h3>",
	     footer: null,
	     base: false ,
       removeScripts: true,
       copyTagClasses: true,
       doctypeString: '<!DOCTYPE html>'
    });
  }
});
