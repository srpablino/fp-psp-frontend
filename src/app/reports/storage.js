import Storage from 'backbone.storage';
import CollectionFamilyOrganization from './families/by_organization/collection';
import ModelFamilyOrganization from './families/by_organization/model';

var ReportsStorage = Storage.extend({
  model: ModelFamilyOrganization,
  collection: CollectionFamilyOrganization,
    getSubHeaderItems() {
      return {
        navigationItems: [
          {
            name: t(`header.reports`),
            link: `/#reports/families/byOrganization`
          }
        ]
      };
    }
  });

  export default new ReportsStorage();
