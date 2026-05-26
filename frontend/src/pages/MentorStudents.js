import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Input, Button } from '../components/Common';

const MentorStudents = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async (params = {}) => {
    try {
      setLoading(true);
      const response = await mentorAPI.searchStudents(params);
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents({ query, department });
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-sm text-slate-400 mt-1">Search and review students assigned to you.</p>
        </div>
      </div>

      <Card className="mb-6 card-glass">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3">
          <Input
            label="Search"
            placeholder="Name or roll number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Input
            label="Department"
            placeholder="CSE, ECE..."
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full">Search</Button>
          </div>
        </form>
      </Card>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {students.length === 0 ? (
            <Card>
              <p className="text-slate-400">No students found.</p>
            </Card>
          ) : (
            students.map((student) => (
              <Card key={student._id} className="card-glass">
                <p className="text-slate-400 text-sm">{student.user?.name || 'Student'}</p>
                <h2 className="text-xl font-semibold text-white">{student.user?.name}</h2>
                <p className="text-slate-400">Roll: {student.rollNumber}</p>
                <p className="text-slate-400">Batch: {student.batch?.name || 'N/A'}</p>
                <p className="text-slate-400">Group: {student.group?.name || 'N/A'}</p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MentorStudents;
