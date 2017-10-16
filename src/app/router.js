import Bn from 'backbone';
import Mn from 'backbone.marionette';
import $ from 'jquery';

export default Mn.AppRouter.extend({
  initialize() {
    $('a[data-route]').on('click', function(e) {
      e.preventDefault();
      const route = $(this).attr('href');
      Bn.history.navigate(route, true);
    });
  },

  appRoutes: {
    '': 'showUsers',
    users: 'showUsers',
    organizations: 'showOrganizations'
  },
  onRoute(name, path) {
    // On navigation the active menu did not change,
    // so we do this manually.
    this.selectActiveMenu(path);
  },
  selectActiveMenu(activePath) {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('.nav')
      .find(`a[href=${activePath}]`)
      .parent()
      .addClass('active');
  }
});
