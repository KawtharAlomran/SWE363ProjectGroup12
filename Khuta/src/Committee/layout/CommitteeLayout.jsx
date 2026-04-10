import Layout from '../../shared/Layout';

const NAV_ITEMS = [
  { path: '/committee/assign-courses', label: 'Assign Courses' },
  { path: '/committee/manage-terms',   label: 'Manage Terms'   },
  { path: '/committee/manage-courses', label: 'Manage Courses' },
];

export default function CommitteeLayout() {
  return (
    <Layout
      navItems={NAV_ITEMS}
      userName={sessionStorage.getItem('UserName')}
      userRole="Committee member"
      rootLabel="Committee"
    />
  );
}