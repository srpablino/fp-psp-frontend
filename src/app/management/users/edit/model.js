import Bn from 'backbone';
import env from '../../../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/users`,
  idAttribute: "userId",
  validate() {
    const errors = [];

    if (this.attributes.username === '') {
      errors.push(t('user.formedit.username-required'));
      return errors;
    }

    if (this.attributes.email === '') {
      errors.push(t('user.formedit.email-required'));
      return errors;
    }

    const emailRegExp = /^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (!emailRegExp.test(this.attributes.email)) {
      errors.push(t('user.formedit.email-not-valid'));
      return errors;
    }

    return errors.length > 0 ? errors : undefined;
  }


});
