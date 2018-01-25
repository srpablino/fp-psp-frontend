import Mn from 'backbone.marionette';
import $ from 'jquery';

import Template from './template.hbs';
// import UsersTemplate from './users-template.hbs';
// import IndicatorsTemplate from './indicators-template.hbs';
import FamiliesView from './families/index/layout-view';
import UnderConstrucionTemplate from '../../utils/under_construction_template.hbs';

import storage from '../storage';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
    this.organizationId = options.organizationId;
  },

  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);

    if (this.entity == null) {
      $('#sub-header .navbar-header > .navbar-brand').addClass('subActive');
    } else {
      $(`.sub-menu-tiem > a[href$="${this.entity}"]`)
        .parent()
        .addClass('subActive');
    }
  },

  getTemplate() {
    if (this.entity === 'families') {
      let organizationId = this.organizationId;
      this.app.showViewOnRoute(
        new FamiliesView({
          organizationId,
          app: this.app
        })
      );
      return this.$el.html('');
    }
    if (this.entity === 'users') {
      // return UsersTemplate;
      return UnderConstrucionTemplate;
    }
    if (this.entity === 'indicators') {
      // return IndicatorsTemplate;
      return UnderConstrucionTemplate;
    }

    return Template;
  },

  serializeData() {
    return {
      organization: this.model.attributes
    };
  }
});
