import Bn from 'backbone';
import env from '../../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/surveys`,


  validate(attrs = {}) {
    const errors = [];

    if (attrs.title === '' ) {
      errors.push({field: 'title', message: 'Missing "Title" field', required: true});
    }

    if (attrs.survey_schema === '') {
      errors.push({field: 'title', message: 'Missing "Survey Schema" field', required: true});
    }

    if (attrs.survey_ui_schema === '') {
      errors.push({field: 'title', message: 'Missing "Survey UI Schema" field', required: true});
    }

    return errors.length > 0 ? errors : undefined;
  }
});
