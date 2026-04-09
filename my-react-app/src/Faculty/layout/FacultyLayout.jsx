import Layout from '../../shared/Layout';

const NAV_ITEMS = [
  { path: '/faculty/offered-courses', label: 'Offered Courses' },
  { path: '/faculty/set-preferences', label: 'Set Preferences' },
  { path: '/faculty/assigned-courses', label: 'Assigned Courses' },
  { path: '/faculty/previous-preferences', label: 'Submitted Preferences' },
];

function FacultyLayout() {
  return (
    <Layout
      navItems={NAV_ITEMS}
      userName="Khadija"
      userRole="Faculty member"
      rootLabel="Faculty"
    />
  );
}

export default FacultyLayout;