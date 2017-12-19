import Bn from 'backbone';
import env from '../../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/surveys`,

  validate(attrs = {}) {
    let errors = [];

    if (attrs.title === '') {
      errors.push('Missing "Title" field');
    }

    if (attrs.survey_schema === '') {
      errors.push('Missing "Survey Schema" field');
    }

    if (attrs.survey_ui_schema === '') {
      errors.push('Missing "Survey UI Schema" field');
    }

    return errors.length > 0 ? errors : undefined;
  }
});
