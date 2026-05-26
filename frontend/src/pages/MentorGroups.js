import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button } from '../components/Common';
import { Link } from 'react-router-dom';

const MentorGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await mentorAPI.getAssignedGroups();
        setGroups(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">My Groups</h1>
          <p className="text-sm text-slate-400 mt-1">View assigned groups and their progress.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.length === 0 ? (
          <Card>
            <p className="text-slate-400">No groups assigned yet.</p>
          </Card>
        ) : (
          groups.map((group) => (
            <Card key={group._id} className="card-glass">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Group</p>
                  <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                </div>
              </div>
              <p className="text-slate-400 mb-4">Department: {group.department || 'N/A'}</p>
              <p className="text-slate-400 mb-4">Students: {group.students?.length || 0}</p>
              <div className="flex justify-end">
                <Link to={`/mentor/group/${group._id}`}>
                  <Button size="sm">View details</Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MentorGroups;
