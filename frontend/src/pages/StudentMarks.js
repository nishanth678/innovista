import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Table } from '../components/Common';
import { FiBarChart2 } from 'react-icons/fi';

const StudentMarks = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await studentAPI.getMarks();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load marks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: 'evaluationType', label: 'Type', render: (row) => row.evaluationType.replace('_', ' ').toUpperCase() },
    { key: 'technicalSkills', label: 'Technical', render: (row) => row.technicalSkills || '-' },
    { key: 'progress', label: 'Progress', render: (row) => row.progress || '-' },
    { key: 'communication', label: 'Communication', render: (row) => row.communication || '-' },
    { key: 'presentation', label: 'Presentation', render: (row) => row.presentation || '-' },
    { key: 'totalScore', label: 'Total', render: (row) => row.totalScore || '-' },
    { key: 'remarks', label: 'Remarks' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Marks</h1>

      {error && <Alert type="error" message={error} />}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Internal Marks</p>
                  <p className="text-3xl font-bold text-blue-600">{data.summary.internal}/40</p>
                </div>
                <FiBarChart2 size={32} className="text-blue-600 opacity-20" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Mentor Evaluation</p>
                  <p className="text-3xl font-bold text-green-600">{data.summary.mentorEvaluation}/40</p>
                </div>
                <FiBarChart2 size={32} className="text-green-600 opacity-20" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Progress Marks</p>
                  <p className="text-3xl font-bold text-yellow-600">{data.summary.progress}/40</p>
                </div>
                <FiBarChart2 size={32} className="text-yellow-600 opacity-20" />
              </div>
            </Card>
          </div>

          {/* Marks Table */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Detailed Marks</h2>
            {data.marks.length === 0 ? (
              <p className="text-gray-600">No marks recorded yet.</p>
            ) : (
              <Table columns={columns} data={data.marks} />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentMarks;
