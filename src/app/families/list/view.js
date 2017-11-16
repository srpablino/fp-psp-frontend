import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Collection from './collection';
import ItemView from './item/view';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #cancel': 'handleCancel',
    'click #submit': 'handleSubmit'
  },

  initialize(options) {
    this.collection = new Collection();

  },
  handleCancel() {
    //evento cancelar
    console.log("cancelando...")
    var element = this.$el.find('#family-list');
    element.empty();

  },

  handleSubmit(event) {
    event.preventDefault();
    //evento buscar
    console.log("Enviadno el submit...")

    this.collection.on('sync', this.render);
    this.collection.fetch();

  },

  onRender() {
    var element = this.$el.find('#family-list');
    element.empty();

    this.collection.forEach((item, index) => {

      item.bind('remove', function() {
        this.destroy();
      });

      // Instantiate a familiy item view for each
      var itemView = new ItemView({
        model: item
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });
  }
});
