import Storage from 'backbone.storage';
import Model from './model';

const allMenuItems = {
  mainItem: { link: '#' },
  navigationItems: [
    { name: 'collaborators', link: '#collaborators/hubs' },
    { name: 'hubs', link: '#applications' },
    { name: 'organizations', link: '#organizations' },
    { name: 'reports', link: '#reports/snapshots/byOrganization' },
    { name: 'families', link: '#families' },
    { name: 'surveys', link: '#surveys' },
    { name: 'users', link: '#users' },
    { name: 'faqs', link: '#faqs' }
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
          .filter(item => !(item.link === '#reports/snapshots/byOrganization'))
          .map(item => {
            item.name = t(`header.${item.name}`);
            return item;
          })
      };
      return new Model(items);
    }

    if (session.userHasRole('ROLE_HUB_ADMIN')) {
      const items = {
        mainItem: { link: `#${session.getLoggedUserHomeRoute()}` },
        navigationItems: allMenuItems.navigationItems
          .filter(item => !(item.link.indexOf('#collaborators') !== -1))
	  .filter(item => !(item.link === '#applications'))
          .map(item => {
            item.name = t(`header.${item.name}`);
            return item;
          })

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
          .filter(item => !(item.link === '#applications'))
          .filter(item => !(item.link === '#organizations'))
          .filter(item => !(item.link === '#families'))
          .filter(item => !(item.link.indexOf('#collaborators') !== -1))
          .map(item => {
            item.name = t(`header.${item.name}`);
            return item;
          })
      };
      return new Model(items);
    }

    // regular user
    const items = {
      mainItem: { link: `#${session.getLoggedUserHomeRoute()}` },
      navigationItems: allMenuItems.navigationItems
        .filter(item => !(item.link === '#applications'))
        .filter(item => !(item.link === '#organizations'))
        .filter(item => !(item.link === '#users'))
        .filter(item => !(item.link === '#reports/snapshots/byOrganization'))
        // .filter(item => !(item.link === '#families'))
        .filter(item => !(item.link.indexOf('#collaborators') !== -1))
        .map(item => {
          item.name = t(`header.${item.name}`);
          return item;
        })
    };
    return new Model(items);
  }
});

export default new HeaderStorage();
