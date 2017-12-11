import Mn from 'backbone.marionette';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';

export default Mn.View.extend({
  template: Template,
  regions: {
    list: '#organization-list'
  },
  initialize() {
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(this.loadMore);
    this.collection.on('remove', this.render);
  },
  onRender() {
    console.log('on render organizations layout view');
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  loadMore(e) {
    e.preventDefault();

    var totalHeight = this.$('> div').height(),
    scrollTop = this.$el.scrollTop() + this.$el.height(),
    margin = 200;
   
    // if we are closer than 'margin' to the end of the content, load more books
    if (scrollTop + margin >= totalHeight) {
      this.searchMore();
    }
  },
  searchMore() {
    console.log("Need to load more organizations!");
  }
});
