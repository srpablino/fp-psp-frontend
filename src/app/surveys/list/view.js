import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Collection from './collection';
import ItemView from './item/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #add-new': 'handleAddNew'
  },

  initialize(options) {
    const { add } = options;
    this.collection = new Collection();
    this.collection.on('sync', this.render);
    this.collection.on('remove', this.render);
    this.collection.fetch();
    this.props = {};
    this.props.add = add;
  },

  onRender() {
    var element = this.$el.find('#survey-list');
    element.empty();

    this.collection.forEach(item => {
      item.bind('remove', function() {
        this.destroy();
      });

      var itemView = new ItemView({
        model: item,
        addSurvey: this.props.add,
        deleteSurvey: this.deleteSurvey.bind(this)
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });
  },
  handleAddNew() {
    this.props.add();
  },
  deleteSurvey(model) {
    this.collection.remove(model);
  }
});
