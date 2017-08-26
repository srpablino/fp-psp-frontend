import Bn from 'backbone'
import Mn from 'backbone.marionette'
import RootView from './login/view'

export default Mn.Application.extend({
    
    region: '#main',
    
    onStart() {
        const rootView = new LoginView();
        this.showView(rootView);
    }
    
})