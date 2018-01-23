import Mn from 'backbone.marionette';
import $ from 'jquery';

import template from './template.hbs';

export default Mn.View.extend({
  template,
  events: {
    'click .sub-menu-tiem': 'highlight'
  },
  highlight(e) {
    $(e.target)
      .parent()
      .siblings('.subActive')
      .removeClass('subActive');
    $(e.target)
      .parent()
      .addClass('subActive');
  },

  serializeData() {
    return {
      mainItem: this.model.get('mainItem'),
      navigationItems: this.model.get('navigationItems')
    };
  }
});
