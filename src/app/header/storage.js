import Storage from 'backbone.storage';
import Model from './model';

const allMenuItems = {
  mainItem: { link: '#' },
  navigationItems: [
    { name: 'Collaborators', link: '#collaborators/hubs' },
    { name: 'Organisations', link: '#organizations' },
    { name: 'Reports', link: '#reports' },
    { name: 'Families', link: '#families' },
    { name: 'Surveys', link: '#surveys' },
    { name: 'Users', link: '#users' },
    { name: 'FAQs', link: '#faqs' }
  ]
};

var HeaderStorage = Storage.extend({
  model: Model,
  getByRolesInSession(session) {
    if (!session.isAuthenticationEnabled()) {
      return new Model(allMenuItems);
    }

    if (session.userHasRole('ROLE_ROOT')) {
      const items = {
        navigationItems: allMenuItems.navigationItems
            .filter(item => !(item.link === '#organizations'))
      };
      return new Model(items);
    }

    if (session.userHasRole('ROLE_HUB_ADMIN')) {
      const items = {
        navigationItems: allMenuItems.navigationItems
          .filter(item => !(item.link.indexOf('#collaborators') !== -1))
      };
      return new Model(items);
    }

    // APP_ADMIN is a member and admin
    // of an organization, so cannot CRUD
    // other organizations.
    if (session.userHasRole('ROLE_APP_ADMIN')) {
      const items = {
        mainItem: { link: `#${session.getLoggedUserHomeRoute()}` },
        navigationItems: allMenuItems.navigationItems
          .filter(item => !(item.link === '#organizations'))
          // .filter(item => !(item.link === '#users'))
          .filter(item => !(item.link === '#families'))
          .filter(item => !(item.link.indexOf('#collaborators') !== -1))
      };
      return new Model(items);
    }

    // regular user
    const items = {
      mainItem: { link: `#${session.getLoggedUserHomeRoute()}` },
      navigationItems: allMenuItems.navigationItems
        .filter(item => !(item.link === '#organizations'))
        .filter(item => !(item.link === '#users'))
        .filter(item => !(item.link === '#families'))
        .filter(item => !(item.link.indexOf('#collaborators') !== -1))
    };
    return new Model(items);
  }
});

export default new HeaderStorage();
