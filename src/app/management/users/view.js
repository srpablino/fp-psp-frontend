import Mn from 'backbone.marionette';
import $ from 'jquery';
import { debounce } from 'lodash';
import utils from '../../utils';
import Template from './template.hbs';
import CollectionView from './collection-view';
import UsersModel from './model';
import Collection from './collection';
import storage from './storage';
import OrganizationModel from '../organizations/model';
import env from "../../env";


export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#user-list'
  },
  events: {
    'input #search': 'onSearchInput'
  },
  initialize(options) {
    this.app = options.app || {};
    this.orgModel = options.orgModel || new OrganizationModel();
    // eslint-disable-next-line no-undef
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(debounce(this.loadMore, 50));
    this.collection = new Collection();
    this.collection.on('update', this.showList());
    this.serverFetch();

    this.debounceServerFetch = debounce(this.serverFetch, 500, {
      leading: false,
      trailing: true
    });
  },
  onRender() {
    let headerItems;
    if(this.app.getSession().userHasRole('ROLE_ROOT')){
      headerItems = storage.getUserSubHeaderItems();
    } else if(this.app.getSession().userHasRole('ROLE_APP_ADMIN') && this.orgModel.get('id')){
      headerItems = storage.getAppAdminHeaderItems(this.orgModel);
    } else{
      headerItems = storage.getSubHeaderItems();
    }
    this.app.updateSubHeader(headerItems);
    if(this.app.getSession().userHasRole('ROLE_ROOT') ||
    this.app.getSession().userHasRole('ROLE_HUB_ADMIN')){
      $('a[href$="management/users"]')
        .parent()
        .addClass('subActive');
    }else{
      $(`a[href$="organizations/${this.orgModel.get('id')}/users"]`)
        .parent()
        .addClass('subActive');
    }
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
  },
  onAttach() {
    const session = this.app.getSession();
    if (
      session.userHasRole('ROLE_ROOT') ||
      session.userHasRole('ROLE_HUB_ADMIN') ||
      session.userHasRole('ROLE_APP_ADMIN')
    ) {
      this.$el.find('#add-new').show();
      if(session.userHasRole('ROLE_APP_ADMIN') && this.orgModel){
        this.$el.find('#add-new').attr('href', `#organizations/${this.orgModel.get('id')}/users/new`)
      }
    }
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection })
    );
  },
  onSearchInput() {
    let searchTerm = this.$el.find('#search').val();
    this.debounceServerFetch(searchTerm);
  },
  serverFetch(searchTerm) {
    const container = this.$el.find('.list-container').eq(0);
    const section = utils.getLoadingSection(container);
    section.loading();
    this.collection.url = `${env.API}/users/includeNotActive`;

    this.params = {
      filter: searchTerm,
      page: 1
    };

    this.collection.reset();
    this.collection.fetch({
      data: this.params,
      success(collection, response) {
        collection.reset(response.list);
        collection.currentPage = response.currentPage;
        collection.totalPages = response.totalPages;
        section.reset();
      }
    });
  },
  loadMore(e) {
    e.preventDefault();

    let scrollHeight = $(document).height();
    let scrollPosition = $(window).height() + $(window).scrollTop();
    let margin = 150; // margin to scroll from the bottom

    if (scrollPosition + margin >= scrollHeight) {
      this.searchMore();
    }
  },
  searchMore() {
    var self = this;
    if (this.collection.currentPage < this.collection.totalPages) {
      this.params.page = this.collection.currentPage + 1;

      let moreElements = new UsersModel();
      moreElements.url=`${env.API}/users/includeNotActive`;
      moreElements.fetch({
        data: this.params,
        success(response) {
          self.collection.add(response.get('list'));
          self.collection.currentPage = response.get('currentPage');
        }
      });
    }
  }
});
