import Bn from 'backbone';
import env from '../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/applications`,
  validate() {
    const errors = [];

    if (this.attributes.name === '') {
      errors.push('Missing "Hubs name" field');
      return errors;
    }

    if (this.attributes.code === '') {
      errors.push('Missing "Code" field');
      return errors;
    }

    if (this.attributes.description === '') {
      errors.push('Missing "Description" field');
      return errors;
    }

    return errors.length > 0 ? errors : undefined;
  }
});
