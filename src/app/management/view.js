import Mn from 'backbone.marionette';
import Template from './template.hbs';
import storage from './storage';

export default Mn.View.extend({
  template: Template,
  regions: {
    surveysContent: '#management-content'
  },
  initialize(app) {
    this.app=app.app
  },
  onRender() {
    let headerItems;
    if(this.app.getSession().userHasRole('ROLE_ROOT')){
      headerItems = storage.getUserSubHeaderItems();
    }else{
      headerItems = storage.getSubHeaderItems();
    }
    this.app.updateSubHeader(headerItems);
  }
});
