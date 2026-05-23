import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { StatCard, Card, LoadingSpinner, Alert } from '../components/Common';
import { FiUsers, FiBook, FiUser, FiBarChart2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && <Alert type="error" message={error} />}

      {dashboard && (
        <>
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Students"
              value={dashboard.statistics?.totalStudents || 0}
              icon={FiUsers}
              color="blue"
            />
            <StatCard
              label="Total Mentors"
              value={dashboard.statistics?.totalMentors || 0}
              icon={FiUser}
              color="green"
            />
            <StatCard
              label="Total Groups"
              value={dashboard.statistics?.totalGroups || 0}
              icon={FiUsers}
              color="yellow"
            />
            <StatCard
              label="Total Batches"
              value={dashboard.statistics?.totalBatches || 0}
              icon={FiBook}
              color="red"
            />
          </div>

          {/* Attendance Statistics */}
          {dashboard.attendanceStats?.length > 0 && (
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-4">Attendance Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboard.attendanceStats.map((stat) => (
                  <div key={stat._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm capitalize">{stat._id}</p>
                    <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Project Statistics */}
          {dashboard.projectStats?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">Project Progress Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {dashboard.projectStats.map((stat) => (
                  <div key={stat._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm capitalize">{stat._id}</p>
                    <p className="text-2xl font-bold text-green-600">{stat.count}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;