import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input, Select } from '../components/Common';

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [batches, setBatches] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', department: '', batchId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsResp, batchesResp] = await Promise.all([
        adminAPI.getAllGroups(),
        adminAPI.getAllBatches(),
      ]);
      setGroups(groupsResp.data);
      setBatches(batchesResp.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups or batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createGroup(newGroup);
      setNewGroup({ name: '', department: '', batchId: '' });
      setMessage('Group created successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-sm text-slate-400 mt-1">Create and manage groups across batches.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <Card className="card-glass mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Group</h2>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreate}>
          <Input
            label="Group Name"
            placeholder="Group 1"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            required
          />
          <Input
            label="Department"
            placeholder="CSE"
            value={newGroup.department}
            onChange={(e) => setNewGroup({ ...newGroup, department: e.target.value })}
            required
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Batch</label>
            <select
              value={newGroup.batchId}
              onChange={(e) => setNewGroup({ ...newGroup, batchId: e.target.value })}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>{batch.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit">Create Group</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.length === 0 ? (
            <Card>
              <p className="text-slate-400">No groups created.</p>
            </Card>
          ) : (
            groups.map((group) => (
              <Card key={group._id} className="card-glass">
                <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                <p className="text-slate-400 mt-2">Department: {group.department}</p>
                <p className="text-slate-400">Batch: {group.batch?.name || 'N/A'}</p>
                <p className="text-slate-400">Students: {group.students?.length || 0}</p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGroups;
