import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiBook, FiUsers, FiBarChart2, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const studentItems = [
      { label: 'Dashboard', icon: FiHome, path: '/student/dashboard' },
      { label: 'My Project', icon: FiBook, path: '/student/project' },
      { label: 'Daily Updates', icon: FiActivity, path: '/student/daily-updates' },
      { label: 'Weekly Updates', icon: FiActivity, path: '/student/weekly-updates' },
      { label: 'Attendance', icon: FiBarChart2, path: '/student/attendance' },
      { label: 'Marks', icon: FiBarChart2, path: '/student/marks' },
      { label: 'Profile', icon: FiUser, path: '/profile' },
    ];

    const mentorItems = [
      { label: 'Dashboard', icon: FiHome, path: '/mentor/dashboard' },
      { label: 'My Groups', icon: FiUsers, path: '/mentor/groups' },
      { label: 'Students', icon: FiUser, path: '/mentor/students' },
      { label: 'Attendance', icon: FiBarChart2, path: '/mentor/attendance' },
      { label: 'Marks', icon: FiBarChart2, path: '/mentor/marks' },
      { label: 'Profile', icon: FiUser, path: '/profile' },
    ];

    const adminItems = [
      { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
      { label: 'Batches', icon: FiBook, path: '/admin/batches' },
      { label: 'Groups', icon: FiUsers, path: '/admin/groups' },
      { label: 'Mentors', icon: FiUser, path: '/admin/mentors' },
      { label: 'Students', icon: FiUsers, path: '/admin/students' },
      { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
      { label: 'Profile', icon: FiUser, path: '/profile' },
    ];

    if (user?.role === 'student') return studentItems;
    if (user?.role === 'mentor') return mentorItems;
    if (user?.role === 'admin') return adminItems;
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-400">Menu</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`
              }
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;