import Mn from 'backbone.marionette';
import ItemView from './item/view';

export default Mn.CollectionView.extend({
  childView: ItemView,
  childViewOptions: {
    className: "col-md-3 col-xs-6"
  },
  className: 'list-container row'
});
