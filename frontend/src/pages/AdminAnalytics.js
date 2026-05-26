import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Card, LoadingSpinner, Alert } from '../components/Common';
import { FiUsers, FiBarChart2, FiTrendingUp, FiClipboard } from 'react-icons/fi';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminAPI.getAnalytics();
        setAnalytics(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Dashboard overview for admin analytics.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {analytics && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="card-glass">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Students</p>
                <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
              </div>
              <FiUsers size={32} className="text-sky-400" />
            </div>
          </Card>
          <Card className="card-glass">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Mentors</p>
                <p className="text-3xl font-bold text-white">{analytics.totalMentors}</p>
              </div>
              <FiClipboard size={32} className="text-emerald-400" />
            </div>
          </Card>
          <Card className="card-glass">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Groups</p>
                <p className="text-3xl font-bold text-white">{analytics.totalGroups}</p>
              </div>
              <FiBarChart2 size={32} className="text-yellow-400" />
            </div>
          </Card>
          <Card className="card-glass">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Batches</p>
                <p className="text-3xl font-bold text-white">{analytics.totalBatches}</p>
              </div>
              <FiTrendingUp size={32} className="text-indigo-400" />
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <Card className="card-glass">
          <h2 className="text-xl font-semibold mb-4">Attendance Trends</h2>
          {analytics?.attendanceStats?.length ? (
            <ul className="space-y-3 text-slate-400">
              {analytics.attendanceStats.map((item) => (
                <li key={item._id} className="border border-white/10 rounded-3xl p-4">
                  <span className="font-semibold text-white capitalize">{item._id}</span>: {item.count}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No attendance data available.</p>
          )}
        </Card>
        <Card className="card-glass">
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>
          {analytics?.projectStats?.length ? (
            <ul className="space-y-3 text-slate-400">
              {analytics.projectStats.map((item) => (
                <li key={item._id} className="border border-white/10 rounded-3xl p-4">
                  <span className="font-semibold text-white capitalize">{item._id}</span>: {item.count}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No project data available.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
