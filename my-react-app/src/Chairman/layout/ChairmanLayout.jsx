import Layout from '../../shared/Layout';

const NAV_ITEMS = [
  { path: '/chairman/ics-committee', label: 'Scheduling Committee' },
  { path: '/chairman/ics-faculty',   label: 'ICS Faculty'   },
  { path: '/chairman/ics-courses', label: 'ICS Courses' },
  { path: '/chairman/teaching-load', label: 'Teaching Load' }
];

export default function ChairmanLayout() {
  return (
    <Layout
      navItems={NAV_ITEMS}
      userName="Malak"
      userRole="ICS Chairman"
      rootLabel="Chairman"
    />
  );
}