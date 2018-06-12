import Bn from 'backbone';
import env from '../../env';


export default Bn.Model.extend({
  urlRoot: `${env.API}/org-labels`,
  url(){
    var url = this.urlRoot;
    if(this.get('organizationId') && !this.get('labelId')){
      url += (`/organization/${this.get('organizationId')}`)
    }
    return url;
  }
});
