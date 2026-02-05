import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '@/types/auth'; // Ensure UserRole is imported

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const baseClasses = 'block w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out';
  const activeClasses = 'bg-gradient-to-r from-brand-teal to-brand-teal text-white shadow-lg border-l-4 border-l-brand-yellow';
  const inactiveClasses = 'text-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy hover:border-l-4 hover:border-l-brand-teal border-l-4 border-l-transparent';

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Incident Reports', path: '/admin/dashboard/reports' },
    { name: 'Evacuation Centers', path: '/admin/dashboard/evac-centers' },
    { name: 'News & Media', path: '/admin/dashboard/news' },
    { name: 'Emergency Contacts', path: '/admin/dashboard/contacts' },
    { name: 'Emergency Alerts', path: '/admin/dashboard/alerts' },
    { name: 'Users Management', path: '/admin/dashboard/users' },
    { name: 'Activity Logs', path: '/admin/dashboard/logs' },
  ];

  const barangayNavItems = [
    { name: 'Dashboard', path: '/barangay/dashboard' },
    { name: 'Evacuation Centers', path: '/barangay/dashboard/evac-centers' },
    { name: 'Official Reports', path: '/barangay/dashboard/reports' },
    { name: 'Incident Report', path: '/barangay/dashboard/incident-report' },
    { name: 'Report Status', path: '/barangay/dashboard/incident-status' },
  ];

  const navItems = role === 'admin' ? adminNavItems : barangayNavItems;

  return (
    <div className="w-64 bg-gradient-to-b from-brand-navy-light/5 via-white to-white border-r-2 border-r-brand-navy/10 p-4 fixed h-full overflow-y-auto top-0 left-0 z-50">
      <div className="mb-8 pb-4 border-b-2 border-b-brand-teal/30">
        <h2 className="text-xl font-bold text-brand-navy mb-2 drop-shadow">{role === 'admin' ? 'Admin Panel' : 'Barangay Panel'}</h2>
        <p className="text-brand-navy-alt text-sm">Manage disaster resources</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                }
                end={item.path === `/admin/dashboard` || item.path === `/barangay/dashboard`} // exact match for dashboard link
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;