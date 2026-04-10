import Layout from '../../shared/Layout';

// Navigation items for Faculty sidebar
const NAV_ITEMS = [
  { path: '/faculty/offered-courses', label: 'Offered Courses' },
  { path: '/faculty/set-preferences', label: 'Set Preferences' },
  { path: '/faculty/assigned-courses', label: 'Assigned Courses' },
  { path: '/faculty/previous-preferences', label: 'Submitted Preferences' },
];

function FacultyLayout() {
  return (
    // Reuse shared Layout component and pass Faculty-specific data
    <Layout
      navItems={NAV_ITEMS}        // sidebar links
      userName="Khadija"         // displayed user name
      userRole="Faculty member"  // displayed role
      rootLabel="Faculty"        // breadcrumb root
    />
  );
}

export default FacultyLayout;