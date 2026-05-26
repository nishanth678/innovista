import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { StatCard, Card, LoadingSpinner, Alert, Button } from '../components/Common';
import { FiUsers, FiCheckSquare, FiBarChart2, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await mentorAPI.getDashboard();
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
      <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>

      {error && <Alert type="error" message={error} />}

      {dashboard && (
        <>
          {/* Mentor Info */}
          <Card className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-xl font-semibold">{dashboard.mentor?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-xl font-semibold">{dashboard.mentor?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Employee ID</p>
                <p className="text-xl font-semibold">{dashboard.mentor?.employeeId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Department</p>
                <p className="text-xl font-semibold">{dashboard.mentor?.department}</p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Groups"
              value={dashboard.statistics?.totalGroups || 0}
              icon={FiUsers}
              color="blue"
            />
            <StatCard
              label="Total Students"
              value={dashboard.statistics?.totalStudents || 0}
              icon={FiUser}
              color="green"
            />
            <StatCard
              label="Pending Daily Updates"
              value={dashboard.statistics?.pendingDailyUpdates || 0}
              icon={FiCheckSquare}
              color="yellow"
            />
            <StatCard
              label="Pending Weekly Updates"
              value={dashboard.statistics?.pendingWeeklyUpdates || 0}
              icon={FiBarChart2}
              color="red"
            />
          </div>

          {/* Recent Groups */}
          {dashboard.recentGroups?.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">Recent Groups</h2>
              <div className="space-y-2">
                {dashboard.recentGroups.map((group) => (
                  <div key={group._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{group.name}</p>
                      <p className="text-sm text-gray-600">{group.department}</p>
                    </div>
                    <Link to={`/mentor/group/${group._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
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

export default MentorDashboard;