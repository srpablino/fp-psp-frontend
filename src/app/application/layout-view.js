import Mn from 'backbone.marionette';
import template from './template.hbs';
import SubMenuView from '../header/subheader/view';
import HeaderView from '../header/view';
import headerStorage from '../header/storage';
import subheaderStorage from '../header/subheader/storage';

export default Mn.View.extend({
  template,

  regions: {
    header: '#header',
    content: '#content',
    subheader: '#sub-header'
  },
  initialize(options) {
    this.app = options.app;
    this.showHeader();
  },
  showHeader() {
    const model = headerStorage.getByRolesInSession(this.app.getSession());
    this.getRegion('header').show(new HeaderView({ model }));
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
    this.getRegion('subheader').show(new SubMenuView({ model }));
  },
  showView(view) {
    this.getRegion('content').show(view);
  }
});
