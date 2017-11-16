import Mn from 'backbone.marionette';
import Template from './template.hbs';
import FamilyListView from './list/view';


export default Mn.View.extend({
  template: Template,
  regions: {
    families: '#families-region'
  },
  initialize() {},
  onRender() {
    this.listFamilies();
  },
  listFamilies() {
    const listView = new FamilyListView({

    });
    this.getRegion('families').show(listView);
  }
});
