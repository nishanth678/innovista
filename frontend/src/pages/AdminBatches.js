import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input, TextArea, Modal } from '../components/Common';

const AdminBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBatch, setNewBatch] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');
  const [editingBatch, setEditingBatch] = useState(null);
  const [editBatchData, setEditBatchData] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [confirmDeleteBatchId, setConfirmDeleteBatchId] = useState(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBatches();
      setBatches(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createBatch(newBatch);
      setNewBatch({ name: '', description: '' });
      setMessage('Batch created successfully');
      setError('');
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create batch');
    }
  };

  const openEditBatch = (batch) => {
    setEditingBatch(batch);
    setEditBatchData({
      name: batch.name || '',
      description: batch.description || '',
      startDate: batch.startDate ? batch.startDate.substring(0, 10) : '',
      endDate: batch.endDate ? batch.endDate.substring(0, 10) : '',
    });
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateBatch(editingBatch._id, editBatchData);
      setMessage('Batch updated successfully');
      setError('');
      setEditingBatch(null);
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update batch');
    }
  };

  const handleDeleteBatch = async () => {
    try {
      await adminAPI.deleteBatch(confirmDeleteBatchId);
      setMessage('Batch deleted successfully');
      setError('');
      setConfirmDeleteBatchId(null);
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete batch');
    }
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="text-sm text-slate-400 mt-1">Manage batches for mentors and students.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <Card className="card-glass mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Batch</h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <Input
            label="Name"
            placeholder="Batch A"
            value={newBatch.name}
            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
            required
          />
          <TextArea
            label="Description"
            placeholder="Batch description"
            value={newBatch.description}
            onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
          />
          <div className="md:col-span-2">
            <Button type="submit">Create Batch</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {batches.length === 0 ? (
            <Card>
              <p className="text-slate-400">No batches available.</p>
            </Card>
          ) : (
            batches.map((batch) => (
              <Card key={batch._id} className="card-glass">
                <h2 className="text-xl font-semibold text-white">{batch.name}</h2>
                <p className="text-slate-400 mt-2">{batch.description || 'No description'}</p>
                <p className="text-slate-400 mt-3">Mentor: {batch.mentor?.user?.name || 'Unassigned'}</p>
                <p className="text-slate-400 mt-3">Groups: {batch.groups?.length || 0}</p>
                <p className="text-slate-400">Students: {batch.students?.length || 0}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openEditBatch(batch)} className="py-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmDeleteBatchId(batch._id)} className="py-2">
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingBatch)}
        title="Edit Batch"
        onClose={() => setEditingBatch(null)}
        onConfirm={handleUpdateBatch}
        confirmText="Save"
      >
        {editingBatch && (
          <form className="grid gap-4">
            <Input
              label="Name"
              value={editBatchData.name}
              onChange={(e) => setEditBatchData({ ...editBatchData, name: e.target.value })}
              required
            />
            <TextArea
              label="Description"
              value={editBatchData.description}
              onChange={(e) => setEditBatchData({ ...editBatchData, description: e.target.value })}
            />
            <Input
              label="Start Date"
              type="date"
              value={editBatchData.startDate}
              onChange={(e) => setEditBatchData({ ...editBatchData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={editBatchData.endDate}
              onChange={(e) => setEditBatchData({ ...editBatchData, endDate: e.target.value })}
            />
          </form>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(confirmDeleteBatchId)}
        title="Delete Batch"
        onClose={() => setConfirmDeleteBatchId(null)}
        onConfirm={handleDeleteBatch}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this batch? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AdminBatches;
