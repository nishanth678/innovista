import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings, FiBook, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { label: 'Home', icon: FiHome, path: '/' },
      { label: 'Profile', icon: FiUser, path: '/profile' },
    ];

    const studentItems = [
      { label: 'Dashboard', icon: FiHome, path: '/student/dashboard' },
      { label: 'My Project', icon: FiBook, path: '/student/project' },
      { label: 'Daily Updates', icon: FiSettings, path: '/student/daily-updates' },
      { label: 'Weekly Updates', icon: FiSettings, path: '/student/weekly-updates' },
      { label: 'Attendance', icon: FiBarChart2, path: '/student/attendance' },
      { label: 'Marks', icon: FiBarChart2, path: '/student/marks' },
    ];

    const mentorItems = [
      { label: 'Dashboard', icon: FiHome, path: '/mentor/dashboard' },
      { label: 'My Groups', icon: FiUsers, path: '/mentor/groups' },
      { label: 'Students', icon: FiUser, path: '/mentor/students' },
      { label: 'Attendance', icon: FiBarChart2, path: '/mentor/attendance' },
      { label: 'Marks', icon: FiBarChart2, path: '/mentor/marks' },
    ];

    const adminItems = [
      { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
      { label: 'Batches', icon: FiBook, path: '/admin/batches' },
      { label: 'Groups', icon: FiUsers, path: '/admin/groups' },
      { label: 'Mentors', icon: FiUser, path: '/admin/mentors' },
      { label: 'Students', icon: FiUsers, path: '/admin/students' },
      { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
    ];

    if (user?.role === 'student') return studentItems;
    if (user?.role === 'mentor') return mentorItems;
    if (user?.role === 'admin') return adminItems;
    return commonItems;
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
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white"
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;