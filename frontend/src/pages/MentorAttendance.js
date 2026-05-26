import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button } from '../components/Common';

const MentorAttendance = () => {
  const [groups, setGroups] = useState([]);
  const [attendanceSummaries, setAttendanceSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const groupsResponse = await mentorAPI.getAssignedGroups();
        setGroups(groupsResponse.data);
        const summaryData = {};

        for (const group of groupsResponse.data) {
          const summary = await mentorAPI.getGroupAttendanceSummary(group._id);
          summaryData[group._id] = summary.data;
        }

        setAttendanceSummaries(summaryData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-sm text-slate-400 mt-1">Review attendance summaries for each group.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.length === 0 ? (
          <Card>
            <p className="text-slate-400">No groups available.</p>
          </Card>
        ) : (
          groups.map((group) => {
            const summary = attendanceSummaries[group._id] || [];
            return (
              <Card key={group._id} className="card-glass">
                <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                <p className="text-slate-400">Department: {group.department}</p>
                <div className="mt-4 space-y-2">
                  {summary.length === 0 ? (
                    <p className="text-slate-400">No attendance records yet.</p>
                  ) : (
                    summary.map((item) => (
                      <div key={item.studentId} className="p-3 bg-slate-950 rounded-3xl border border-white/5">
                        <p className="text-white font-semibold">Student ID: {item.studentId}</p>
                        <p className="text-slate-400">Present: {item.present}</p>
                        <p className="text-slate-400">Total: {item.total}</p>
                        <p className="text-slate-400">Percent: {item.percentage}%</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MentorAttendance;
