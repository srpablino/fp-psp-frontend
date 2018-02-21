import Bn from 'backbone';
import env from '../../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/users/addUserRoleApplication`,
  validate() {
    const errors = [];

    if (this.attributes.username === '') {
      errors.push('Missing "Username" field');
      return errors;
    }

    if (this.attributes.email === '') {
      errors.push('Missing "Email" field');
      return errors;
    }

    const emailRegExp = /^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (!emailRegExp.test(this.attributes.email)) {
      errors.push('Email is not valid');
      return errors;
    }

    if (this.attributes.pass === '') {
      errors.push('Missing "Password" field');
      return errors;
    }

    if (this.attributes['password-confirm'] === '') {
      errors.push('Missing "Password Confirmation" field');
      return errors;
    }

    if (this.attributes.pass !== '' && this.attributes['password-confirm'] !== '' &&
      this.attributes.pass !== this.attributes['password-confirm']) {
      errors.push('Password confirmation failed');
      return errors;
    }

    if (this.attributes.application === undefined && this.attributes.organization === undefined) {
      errors.push('Missing "Organization" field');
      return errors;
    } else if (this.attributes.role === undefined) {
      errors.push('Missing "Role" field');
      return errors;
    } else if (this.attributes.role === null) {
      errors.push('Role null');
      return errors;
    }

    return errors.length > 0 ? errors : undefined;
  }
});
