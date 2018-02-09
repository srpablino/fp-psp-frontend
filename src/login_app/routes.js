
import Mn from 'backbone.marionette'

export default Mn.AppRouter.extend({

    appRoutes: {
        'login': 'showLogin',
        'reset': 'showReset'
    }

})
