import Mn from 'backbone.marionette';
import Template from './template.hbs';
import FamiliesTemplate from './families/index/layout-template.hbs';
import UsersTemplate from './users-template.hbs';
import IndicatorsTemplate from './indicators-template.hbs';
import FamiliesView from './families/index/layout-view';

import storage from '../storage';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
  },

  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);
  },

  getTemplate() {
    if (this.entity === 'families') {
      this.app.showViewOnRoute(new FamiliesView());
      return  Template();
    }
    if (this.entity === 'users') {
      return UsersTemplate;
    }
    if (this.entity === 'indicators') {
      return IndicatorsTemplate;
    }
    return Template;
  },

  serializeData() {
    return {
      organization: this.model.attributes
    };
  }
});
