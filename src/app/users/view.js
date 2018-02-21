import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';
import { debounce } from 'lodash';
import utils from '../utils';
import Template from './template.hbs';
import CollectionView from './collection-view';
import UsersModel from './model';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#user-list'
  },
  events: {
    'keyup #search': 'handleSearch'
  },
  initialize(options) {
    this.app = options.app;
    // eslint-disable-next-line no-undef
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(this.loadMore);

    this.collection = new Bn.Collection(this.model.get('list'));
    this.collection.on('remove', this.render);
    this.search = debounce(this.search, 300);
  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
  },
  onAttach() {
    const session = this.app.getSession();
    if (session.userHasRole('ROLE_ROOT')
      || session.userHasRole('ROLE_HUB_ADMIN')
      || session.userHasRole('ROLE_APP_ADMIN')
    ) {
      this.$el.find('#add-new').show();
    }
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  handleSearch() {
    var userName = this.$el.find('#search').val();
    this.collection = new Bn.Collection(this.model.get('list'));
    if(!userName){
      this.showList();
      return;
    }
    const container = this.$el.find('.list-container').eq(0);
    const section = utils.getLoadingSection(container);
    section.loading();
    this.getRegion('list').empty();
    setTimeout(() => {
      var filtered = this.collection.filter((user) => user.get("username").toLowerCase().includes(userName.toLowerCase()));
      this.collection = new Bn.Collection(filtered);
      this.showList();
      section.reset();
    }, 1000);
  },
  search(term) {
    if (!term) {
      return null;
    }
    const filtered = this.collection.filterByValue(term);

    if (filtered && filtered.length > 0) {
      return filtered;
    }

    return null;
  },
  loadMore(e) {
    e.preventDefault();

    let scrollHeight = $(document).height();
    let scrollPosition = $(window).height() + $(window).scrollTop();
    let margin = 150; // margin to scroll from the bottom

    // if we are closer than 'margin' to the end of the content, load more books
    if (scrollPosition + margin >= scrollHeight) {
      this.searchMore();
    }
  },
  searchMore() {
    var self = this;

    // if not all users have been loaded
    if (self.model.get('currentPage') < self.model.get('totalPages')) {
      let params = {
        page: self.model.get('currentPage') + 1,
        per_page: 12
      };

      let moreElements = new UsersModel();
      moreElements.fetch({
        data: params,
        success(response) {
          self.collection.add(response.get('list'));
          self.model.set('currentPage', response.get('currentPage'));
        }
      });
    }
  }
});
