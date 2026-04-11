import Layout from '../../shared/Layout';

// Navigation items for Faculty sidebar
const NAV_ITEMS = [
  { path: '/chairman/ics-committee', label: 'Scheduling Committee' },
  { path: '/chairman/ics-faculty',   label: 'ICS Faculty'   },
  { path: '/chairman/ics-courses', label: 'ICS Courses' },
  { path: '/chairman/teaching-load', label: 'Teaching Load' }
];

export default function ChairmanLayout() {
  return (
    // Reuse shared Layout component and pass Chsirman-specific data
    <Layout
      navItems={NAV_ITEMS}
      userName={sessionStorage.getItem('UserName')}
      userRole="ICS Chairman"
      rootLabel="Chairman"
    />
  );
}