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
    const { addOrganization } = options;
    this.collection = new Collection();
    this.collection.on('sync', this.render);
    this.collection.on('remove', this.render);
    this.collection.fetch();
    this.props = {};
    this.props.addOrganization = addOrganization;
  },

  onRender() {
    var element = this.$el.find('#organization-list');
    element.empty();

    this.collection.forEach((item, index) => {
      // Temporary random image
      item.attributes[
        'imageUrl'
      ] = `http://lorempixel.com/400/200/cats/${index}`;

      item.bind('remove', function() {
        this.destroy();
      });

      // Instantiate a organization item view for each
      var itemView = new ItemView({
        model: item,
        addOrganization: this.props.addOrganization,
        deleteOrganization: this.deleteOrganization.bind(this)
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });
  },
  handleAddNew() {
    this.props.addOrganization();
  },
  deleteOrganization(organizationModel) {
    this.collection.remove(organizationModel);
  }
});
