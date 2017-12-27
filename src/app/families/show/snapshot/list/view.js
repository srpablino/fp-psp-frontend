import Mn from 'backbone.marionette';
import Template from './template.hbs';
import storage from '../../../storage';
import CollectionView from './collection-view';
import Collection from './collection';
import $ from 'jquery';

export default Mn.View.extend({
  template: Template,
  collection: CollectionView,
  regions: {
    list: '#family-snapshots'
  },
  initialize(options) {
    this.app = options.app;
    this.snapshotId = options.snapshotId;
    this.collection = options.collection;
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);

    $('#subMenuItem > a[href$="snapshots"]').parent().addClass('subActive');

    this.showList();
  },
  showList() {
    var self = this;
    var collection = new Collection();
    collection.fetch({
      data: { family_id: this.model.attributes.id }
    }).done(function(){
      self.getRegion('list').show(
        new CollectionView({ collection: collection})
      );
    });
  },

});
