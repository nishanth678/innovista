import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { StatCard, Card, LoadingSpinner, Alert } from '../components/Common';
import { FiBook, FiBarChart2, FiCheckSquare, FiCalendar } from 'react-icons/fi';

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {error && <Alert type="error" message={error} />}

      {dashboard && (
        <>
          {/* Student Info */}
          <Card className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-xl font-semibold">{dashboard.student?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Roll Number</p>
                <p className="text-xl font-semibold">{dashboard.student?.rollNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Department</p>
                <p className="text-xl font-semibold">{dashboard.student?.department}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Group</p>
                <p className="text-xl font-semibold">{dashboard.student?.group}</p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Attendance"
              value={`${dashboard.attendance?.percentage}%`}
              icon={FiCalendar}
              color="blue"
            />
            <StatCard
              label="Internal Marks"
              value={dashboard.marks?.internal || 0}
              icon={FiBarChart2}
              color="green"
            />
            <StatCard
              label="Daily Updates"
              value={dashboard.updatesCount?.daily || 0}
              icon={FiCheckSquare}
              color="yellow"
            />
            <StatCard
              label="Weekly Updates"
              value={dashboard.updatesCount?.weekly || 0}
              icon={FiBook}
              color="red"
            />
          </div>

          {/* Project Info */}
          {dashboard.project && (
            <Card className="mb-8">
              <h2 className="text-xl font-bold mb-4">Current Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Title</p>
                  <p className="text-lg font-semibold">{dashboard.project.title}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-lg font-semibold capitalize">{dashboard.project.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${dashboard.project.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{dashboard.project.progressPercentage}%</p>
                </div>
              </div>
            </Card>
          )}

          {/* Mentor & Guide Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboard.mentor && (
              <Card>
                <h3 className="font-bold mb-4">Mentor</h3>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold">{dashboard.mentor.name}</p>
                <p className="text-gray-600 text-sm mt-2">Email</p>
                <p className="font-semibold">{dashboard.mentor.email}</p>
              </Card>
            )}
            {dashboard.guide && (
              <Card>
                <h3 className="font-bold mb-4">Guide</h3>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold">{dashboard.guide.name}</p>
                <p className="text-gray-600 text-sm mt-2">Email</p>
                <p className="font-semibold">{dashboard.guide.email}</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;