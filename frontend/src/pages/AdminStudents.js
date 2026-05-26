import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input, Select, Modal } from '../components/Common';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    batchId: '',
    groupId: '',
    mentorId: '',
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    department: '',
    batchId: '',
    groupId: '',
    mentorId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsResp, batchesResp, groupsResp, mentorsResp] = await Promise.all([
        adminAPI.getAllStudents(),
        adminAPI.getAllBatches(),
        adminAPI.getAllGroups(),
        adminAPI.getAllMentors(),
      ]);
      setStudents(studentsResp.data);
      setBatches(batchesResp.data);
      setGroups(groupsResp.data);
      setMentors(mentorsResp.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load student data');
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
      await adminAPI.addStudent(form);
      setMessage('Student added successfully');
      setError('');
      setForm({ name: '', email: '', password: '', rollNumber: '', department: '', batchId: '', groupId: '', mentorId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const openEditStudent = (student) => {
    setEditingStudent(student);
    setEditData({
      name: student.user?.name || '',
      phone: student.user?.phone || '',
      department: student.department || '',
      batchId: student.batch?._id || '',
      groupId: student.group?._id || '',
      mentorId: student.mentor?._id || '',
    });
  };

  const handleUpdateStudent = async () => {
    try {
      await adminAPI.updateStudent(editingStudent._id, editData);
      setMessage('Student updated successfully');
      setError('');
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await adminAPI.deleteStudent(confirmDeleteStudentId);
      setMessage('Student deleted successfully');
      setError('');
      setConfirmDeleteStudentId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-sm text-slate-400 mt-1">Add and manage students across batches and groups.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <Card className="card-glass mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Student</h2>
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleCreate}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Roll Number" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          <div>
            <label className="text-sm font-medium text-gray-700">Batch</label>
            <select
              value={form.batchId}
              onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>{batch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Group</label>
            <select
              value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Mentor</label>
            <select
              value={form.mentorId}
              onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>{mentor.user?.name || mentor.employeeId}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {students.length === 0 ? (
            <Card>
              <p className="text-slate-400">No students available.</p>
            </Card>
          ) : (
            students.map((student) => (
              <Card key={student._id} className="card-glass">
                <h2 className="text-xl font-semibold text-white">{student.user?.name || 'Student'}</h2>
                <p className="text-slate-400">Roll: {student.rollNumber}</p>
                <p className="text-slate-400">Department: {student.department}</p>
                <p className="text-slate-400">Batch: {student.batch?.name || 'N/A'}</p>
                <p className="text-slate-400">Group: {student.group?.name || 'N/A'}</p>
                <p className="text-slate-400">Mentor: {student.mentor?.user?.name || 'N/A'}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openEditStudent(student)} className="py-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmDeleteStudentId(student._id)} className="py-2">
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingStudent)}
        title="Edit Student"
        onClose={() => setEditingStudent(null)}
        onConfirm={handleUpdateStudent}
        confirmText="Save"
      >
        {editingStudent && (
          <form className="grid gap-4">
            <Input label="Name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required />
            <Input label="Phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
            <Input label="Department" value={editData.department} onChange={(e) => setEditData({ ...editData, department: e.target.value })} />
            <Select label="Batch" value={editData.batchId} onChange={(e) => setEditData({ ...editData, batchId: e.target.value })} required>
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>{batch.name}</option>
              ))}
            </Select>
            <Select label="Group" value={editData.groupId} onChange={(e) => setEditData({ ...editData, groupId: e.target.value })} required>
              <option value="">Select group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </Select>
            <Select label="Mentor" value={editData.mentorId} onChange={(e) => setEditData({ ...editData, mentorId: e.target.value })} required>
              <option value="">Select mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>{mentor.user?.name || mentor.employeeId}</option>
              ))}
            </Select>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(confirmDeleteStudentId)}
        title="Delete Student"
        onClose={() => setConfirmDeleteStudentId(null)}
        onConfirm={handleDeleteStudent}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this student? This will also remove their login.</p>
      </Modal>
    </div>
  );
};

export default AdminStudents;
