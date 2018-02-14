import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';

import { debounce } from 'lodash';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import storage from './storage';
import utils from '../../../utils';
import HubsModel from './model';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#hub-list'
  },
  events: {
    'keyup #search': 'handleSearch'
  },
  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
    // eslint-disable-next-line no-undef
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(this.loadMore);

    this.collection = new Bn.Collection(this.model.get('list'));
    this.collection.on('remove', this.render);
    this.search = debounce(this.search, 300);
  },
  onRender() {
    const headerItems = storage.getMainSubHeaderItems();
    this.app.updateSubHeader(headerItems);

      $(`#subMenuItem > a[href$="collaborators/${this.entity}"]`)
        .parent()
        .addClass('subActive');

    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
  },
  getTemplate() {
    return Template;
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  handleSearch() {
    const container = this.$el.find('.list-container').eq(0);
    const section = utils.getLoadingSection(container);
    section.loading();
    this.getRegion('list').empty();
    setTimeout(() => {
      storage.findAll().then(collection => {
        this.collection = collection;
        this.showList();
        section.reset();
      });
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

    // if not all organizations have been loaded
    if (self.model.get('currentPage') < self.model.get('totalPages')) {
      let params = {
        page: self.model.get('currentPage') + 1,
        per_page: 12
      };

      let moreElements = new HubsModel();
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
