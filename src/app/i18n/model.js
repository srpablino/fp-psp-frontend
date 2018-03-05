import Bn from 'backbone';

export default Bn.Model.extend({

    initialize(options) {
        this.code = options.code;
    },

    urlRoot() {
        return `static/i18n/${this.code}.json`;
    }
});
