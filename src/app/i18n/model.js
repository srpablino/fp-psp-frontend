import Bn from 'backbone';

export default Bn.Model.extend({

    initialize: options => {
        this.code = options.code;
    },
    urlRoot: () => `static/i18n/${this.code}.json`
});
