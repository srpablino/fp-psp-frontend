import Mn from 'backbone.marionette';
import ItemView from './item/view';
import $ from 'jquery';

export default Mn.CollectionView.extend({
  childView: ItemView,
  childViewOptions: {
    className: "col-md-3 col-xs-6"
  },
  className: 'list-container row',
  childEvents: {
    'delete:model': 'handleDelete'
  },
  onRender() {
    this.$el.find('#search').focus();

  },
  onChildviewDeleteItem(childView) {
    this.collection.remove(childView.model);
  }
});
