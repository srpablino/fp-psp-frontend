import FamilyOrganizationView from './snapshots/by_organization/view';
import DatatableReportView from './datatables/view';
import SnapshotsReportView from './snapshots/view';

const reports = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'reports/snapshots/organizations(/)': 'showFamiliesByOrganization',
      'reports/datatable': 'datatableReport',
      'reports/snapshots': 'snapshotsReport'
    },
    controller: {
      showFamiliesByOrganization() {
        app.showViewOnRoute(new FamilyOrganizationView({app}));
      },
      datatableReport() {
        app.showViewOnRoute(new DatatableReportView({app}));
      },
      snapshotsReport() {
        app.showViewOnRoute(new SnapshotsReportView({app}));
      }
    }
  };
  return routes;
};

export default reports;
