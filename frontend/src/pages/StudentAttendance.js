import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Table } from '../components/Common';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';

const Attendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await studentAPI.getAttendance();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const statusClass = {
          'present': 'bg-green-100 text-green-800',
          'absent': 'bg-red-100 text-red-800',
          'late': 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass[row.status]}`}>
            {row.status.toUpperCase()}
          </span>
        );
      }
    },
    { key: 'remarks', label: 'Remarks' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Attendance</h1>

      {error && <Alert type="error" message={error} />}

      {data && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Present</p>
                  <p className="text-2xl font-bold text-green-600">{data.summary.present}</p>
                </div>
                <FiCheck size={32} className="text-green-600 opacity-20" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{data.summary.absent}</p>
                </div>
                <FiX size={32} className="text-red-600 opacity-20" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{data.summary.late}</p>
                </div>
                <FiClock size={32} className="text-yellow-600 opacity-20" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Percentage</p>
                  <p className="text-2xl font-bold text-blue-600">{data.summary.percentage}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance Table */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
            {data.attendance.length === 0 ? (
              <p className="text-gray-600">No attendance records yet.</p>
            ) : (
              <Table columns={columns} data={data.attendance} />
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Attendance;
