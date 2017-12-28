import Mn from 'backbone.marionette';
import template from './template.hbs';
import $ from 'jquery';

export default Mn.View.extend({
  template,
  events: {
    "click #subMenuItem" : "highlight"
  },
  highlight(e) {
    $(e.target).parent().siblings('.subActive').removeClass('subActive');
    $(e.target).parent().addClass('subActive');
  },

  serializeData() {
    return {
      mainItem: this.model.get('mainItem'),
      navigationItems: this.model.get('navigationItems')
    };
  }
});
