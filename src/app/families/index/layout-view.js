import Mn from 'backbone.marionette';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';

export default Mn.View.extend({
  template: Template,
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit'
  },
  initialize() {
    this.collection.on('remove', this.render);
  },
  onRender() {
    // this.getRegion('list').show(
    //   new CollectionView({ collection: this.collection })
    // );
  },
  handleSubmit(event) {
    event.preventDefault();
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );

    // this.$el
    //   .find('#form')
    //   .serializeArray()
    //   .forEach(element => {
    //     this.model.set(element.name, element.value);
    //   });


  }
});
