import Mn from 'backbone.marionette';
import Template from './template.hbs';
import env from '../env';

export default Mn.View.extend({
  template: Template,
  serializeData() {
    return { appVersion: env.appVersion, appPlatform: env.platform };
  }
});
