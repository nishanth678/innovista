import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input, TextArea } from '../components/Common';

const MentorMarks = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    evaluationType: 'mentor_evaluation',
    technicalSkills: 0,
    progress: 0,
    communication: 0,
    presentation: 0,
    remarks: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await mentorAPI.searchStudents({});
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSelect = (student) => {
    setSelectedStudent(student);
    setFormData({
      evaluationType: 'mentor_evaluation',
      technicalSkills: 0,
      progress: 0,
      communication: 0,
      presentation: 0,
      remarks: '',
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student first.');
      return;
    }

    try {
      await mentorAPI.giveMarks({
        studentId: selectedStudent._id,
        evaluationType: formData.evaluationType,
        technicalSkills: Number(formData.technicalSkills),
        progress: Number(formData.progress),
        communication: Number(formData.communication),
        presentation: Number(formData.presentation),
        remarks: formData.remarks,
      });
      setMessage('Marks recorded successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit marks');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Marks</h1>
          <p className="text-sm text-slate-400 mt-1">Record evaluation marks for your students.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="card-glass">
          <h2 className="text-xl font-semibold mb-4">Select Student</h2>
          <div className="space-y-3">
            {students.length === 0 ? (
              <p className="text-slate-400">No students assigned.</p>
            ) : (
              students.map((student) => (
                <button
                  key={student._id}
                  onClick={() => handleSelect(student)}
                  className={`w-full text-left p-4 rounded-3xl border ${selectedStudent?._id === student._id ? 'border-sky-500 bg-slate-950' : 'border-white/10 bg-slate-950/80'} hover:border-sky-400`}
                >
                  <p className="font-semibold text-white">{student.user?.name || 'Student'}</p>
                  <p className="text-slate-400 text-sm">Roll: {student.rollNumber}</p>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="xl:col-span-2 card-glass">
          <h2 className="text-xl font-semibold mb-4">Record Marks</h2>
          {selectedStudent ? (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                label="Evaluation Type"
                value={formData.evaluationType}
                onChange={(e) => setFormData({ ...formData, evaluationType: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Technical Skills"
                  type="number"
                  value={formData.technicalSkills}
                  onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                />
                <Input
                  label="Progress"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Communication"
                  type="number"
                  value={formData.communication}
                  onChange={(e) => setFormData({ ...formData, communication: e.target.value })}
                />
                <Input
                  label="Presentation"
                  type="number"
                  value={formData.presentation}
                  onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                />
              </div>
              <TextArea
                label="Remarks"
                placeholder="Add feedback or remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
              <Button type="submit">Submit Marks</Button>
            </form>
          ) : (
            <p className="text-slate-400">Select a student from the left to record marks.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MentorMarks;
