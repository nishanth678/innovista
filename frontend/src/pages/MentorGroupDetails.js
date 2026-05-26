import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert } from '../components/Common';

const MentorGroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await mentorAPI.getGroupDetails(groupId);
        setGroup(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load group details');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Group Details</h1>
          <p className="text-sm text-slate-400 mt-1">Review students, project, and group progress.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {group && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-glass">
            <h2 className="text-xl font-semibold mb-4">{group.name}</h2>
            <p className="text-slate-400">Department: {group.department || 'N/A'}</p>
            <p className="text-slate-400">Batch: {group.batch?.name || 'N/A'}</p>
            <p className="text-slate-400">Mentor: {group.mentor?.user?.name || 'N/A'}</p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Team Members</h3>
              {group.students?.length ? (
                <ul className="space-y-3">
                  {group.students.map((student) => (
                    <li key={student._id} className="p-4 bg-slate-950 rounded-3xl border border-white/5">
                      <p className="font-semibold text-white">{student.user?.name || 'Student'}</p>
                      <p className="text-slate-400 text-sm">Roll: {student.rollNumber}</p>
                      <p className="text-slate-400 text-sm">Department: {student.department}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">No students assigned yet.</p>
              )}
            </div>
          </Card>

          <Card className="card-glass">
            <h2 className="text-xl font-semibold mb-4">Project</h2>
            {group.project ? (
              <div className="space-y-4">
                <p className="text-slate-400">Title: {group.project.title}</p>
                <p className="text-slate-400">Status: {group.project.status}</p>
                <p className="text-slate-400">Progress: {group.project.progressPercentage}%</p>
                <p className="text-slate-400">Technologies: {group.project.technologies?.join(', ') || 'N/A'}</p>
              </div>
            ) : (
              <p className="text-slate-400">No project assigned to this group yet.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default MentorGroupDetails;
