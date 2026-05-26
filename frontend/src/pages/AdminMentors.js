import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input, Select, Modal } from '../components/Common';

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    specialization: '',
  });
  const [editingMentor, setEditingMentor] = useState(null);
  const [editData, setEditData] = useState({ name: '', phone: '', department: '', specialization: '' });
  const [assignMentor, setAssignMentor] = useState(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [confirmDeleteMentorId, setConfirmDeleteMentorId] = useState(null);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const [mentorsResp, batchesResp] = await Promise.all([
        adminAPI.getAllMentors(),
        adminAPI.getAllBatches(),
      ]);
      setMentors(mentorsResp.data);
      setBatches(batchesResp.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createMentor(form);
      setForm({ name: '', email: '', password: '', employeeId: '', department: '', specialization: '' });
      setMessage('Mentor created successfully');
      setError('');
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create mentor');
    }
  };

  const openEditMentor = (mentor) => {
    setEditingMentor(mentor);
    setEditData({
      name: mentor.user?.name || '',
      phone: mentor.user?.phone || '',
      department: mentor.department || '',
      specialization: mentor.specialization || '',
    });
  };

  const handleUpdateMentor = async () => {
    try {
      await adminAPI.updateMentor(editingMentor._id, editData);
      setMessage('Mentor updated successfully');
      setError('');
      setEditingMentor(null);
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update mentor');
    }
  };

  const openAssignMentor = (mentor) => {
    setAssignMentor(mentor);
    setSelectedBatchIds((mentor.batches || []).map((batch) => batch._id));
  };

  const handleAssignBatches = async () => {
    try {
      await adminAPI.assignMentorToBatches(assignMentor._id, { batchIds: selectedBatchIds });
      setMessage('Mentor batch assignments updated');
      setError('');
      setAssignMentor(null);
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign batches');
    }
  };

  const handleDeleteMentor = async () => {
    try {
      await adminAPI.deleteMentor(confirmDeleteMentorId);
      setMessage('Mentor deleted successfully');
      setError('');
      setConfirmDeleteMentorId(null);
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete mentor');
    }
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Mentors</h1>
          <p className="text-sm text-slate-400 mt-1">Create, assign, edit and delete mentor accounts.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <Card className="card-glass mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Mentor</h2>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleCreate}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          <div className="md:col-span-3">
            <Button type="submit">Create Mentor</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentors.length === 0 ? (
            <Card>
              <p className="text-slate-400">No mentors found.</p>
            </Card>
          ) : (
            mentors.map((mentor) => (
              <Card key={mentor._id} className="card-glass">
                <h2 className="text-xl font-semibold text-white">{mentor.user?.name || 'Mentor'}</h2>
                <p className="text-slate-400">Email: {mentor.user?.email}</p>
                <p className="text-slate-400">Employee ID: {mentor.employeeId}</p>
                <p className="text-slate-400">Department: {mentor.department}</p>
                <p className="text-slate-400">Specialization: {mentor.specialization || 'N/A'}</p>
                <p className="text-slate-400">Batches: {(mentor.batches || []).length}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openEditMentor(mentor)} className="py-2">
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => openAssignMentor(mentor)} className="py-2">
                    Assign Batches
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmDeleteMentorId(mentor._id)} className="py-2">
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingMentor)}
        title="Edit Mentor"
        onClose={() => setEditingMentor(null)}
        onConfirm={handleUpdateMentor}
        confirmText="Save"
      >
        {editingMentor && (
          <form className="grid gap-4">
            <Input
              label="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              required
            />
            <Input
              label="Phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
            <Input
              label="Department"
              value={editData.department}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            />
            <Input
              label="Specialization"
              value={editData.specialization}
              onChange={(e) => setEditData({ ...editData, specialization: e.target.value })}
            />
          </form>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(assignMentor)}
        title="Assign Batches"
        onClose={() => setAssignMentor(null)}
        onConfirm={handleAssignBatches}
        confirmText="Save"
      >
        {assignMentor && (
          <div className="grid gap-4">
            <p className="text-slate-400">A mentor can handle up to 10 batches.</p>
            <Select
              label="Select Batches"
              className="h-56"
              multiple
              value={selectedBatchIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, (option) => option.value);
                setSelectedBatchIds(values);
              }}
              required
            >
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </Select>
            <small className="text-sm text-slate-500">Hold Ctrl / Cmd to select multiple batches.</small>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(confirmDeleteMentorId)}
        title="Delete Mentor"
        onClose={() => setConfirmDeleteMentorId(null)}
        onConfirm={handleDeleteMentor}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this mentor? This will also remove their login.</p>
      </Modal>
    </div>
  );
};

export default AdminMentors;
