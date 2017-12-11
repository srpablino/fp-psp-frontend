import Mn from 'backbone.marionette';
import Template from './template.hbs';
import faker from 'faker';

export default Mn.View.extend({
  template: Template,

  serializeData() {
    return {
      family: this.model.attributes,
      imageUrl: this.getImage()
    };
  },
  getImage() {
    return faker.image.imageUrl(100, 100, 'people');
  }
});
