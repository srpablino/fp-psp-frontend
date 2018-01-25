import Mn from 'backbone.marionette';
import template from './template.hbs';
import SubMenuView from '../header/subheader/view';
import HomeView from '../home/view';
import HeaderView from '../header/view';
import headerStorage from '../header/storage';
import subheaderStorage from '../header/subheader/storage';

import FooterView from '../footer/view';

export default Mn.View.extend({
  template,

  regions: {
    header: '#header',
    flashes: '#flashes',
    content: '#content',
    subheader: '#sub-header',
    footer: '#footer',
    overlay: '#overlay'
  },
  initialize(options) {
    this.app = options.app;
    this.showHeader();
    this.showFooter();
    this.showHome();
  },
  showHeader() {
    const model = headerStorage.getByRolesInSession(this.app.getSession());
    this.getRegion('header').show(new HeaderView({model, app: this.app}));
  },
  showFooter() {
    this.getRegion('footer').show(new FooterView());
  },
  showHome() {
    this.getRegion('content').show(new HomeView());
  },
  updateSubHeader(headerItems) {
    this.getRegion('subheader').empty();

    if (!headerItems) {
      return;
    }
    const model = subheaderStorage.getByRolesInSession(
      headerItems,
      this.app.getSession()
    );
    this.getRegion('subheader').show(new SubMenuView({model}));
  },
  showView(view) {
    this.getRegion('content').show(view);
  }
});
