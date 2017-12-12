import Mn from 'backbone.marionette';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import OrganizationsModel from '../model';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#organization-list'
  },
  initialize() {
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(this.loadMore);

    this.collection = new Backbone.Collection(this.model.get('list'));
    this.collection.on('remove', this.render);
  },
  onRender() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  loadMore(e) {
    e.preventDefault();
    
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    var margin = 150; //margin to scroll from the bottom

    // if we are closer than 'margin' to the end of the content, load more books
    if (scrollPosition + margin >= scrollHeight) {
      this.searchMore();
    }

  },
  searchMore() {
    var self = this;

    //if not all organizations have been loaded
    if(self.model.get('currentPage') < self.model.get('totalPages')){
      var params = { 
        page: self.model.get('currentPage') + 1,
        per_page: 12
      };

      var moreElements = new OrganizationsModel();
      moreElements.fetch({
        data: params,
        success:function(response){
          self.collection.add(response.get('list'));
          self.model.set('currentPage', response.get('currentPage'));
        } 
      });
    }
  }
});
