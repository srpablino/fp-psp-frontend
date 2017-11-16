import Mn from 'backbone.marionette';
import template from './template.hbs';
import UsersView from '../users/view';

import SubMenuView from '../subheader/view';
import SubMenuModel from '../subheader/model';

import HeaderView from '../header/view';

import FooterView from '../footer/view';

export default Mn.View.extend({
  template,

  regions: {
    header: '#header',
    content: '#content',
    subheader: '#sub-header',
    footer: '#footer'
  },
  initialize(options) {
    this.showHeader();
    this.showFooter();
    this.app = options.app;
  },
  showHeader() {
    this.getRegion('header').show(new HeaderView());
  },
  showFooter() {
    this.getRegion('footer').show(new FooterView());
  },
  updateSubHeader(data) {
    this.getRegion('subheader').empty();

    if (!data) {
      return;
    }

    this.getRegion('subheader').show(
      new SubMenuView({ model: new SubMenuModel(data) })
    );
  },
  showView(view) {
    this.getRegion('content').show(view);
  }
});
