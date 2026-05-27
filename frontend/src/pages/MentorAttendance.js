import React, { useState, useEffect } from 'react';
import { mentorAPI } from '../services/api';
import { Card, LoadingSpinner, Alert, Button, Input } from '../components/Common';

const MentorAttendance = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [attendanceSummaries, setAttendanceSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [marking, setMarking] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const groupsResponse = await mentorAPI.getAssignedGroups();
        setGroups(groupsResponse.data);
        if (groupsResponse.data.length > 0) {
          setSelectedGroupId(groupsResponse.data[0]._id);
        }
        const summaryData = {};

        for (const group of groupsResponse.data) {
          const summary = await mentorAPI.getGroupAttendanceSummary(group._id);
          summaryData[group._id] = summary.data;
        }

        setAttendanceSummaries(summaryData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMarkAttendance = async (studentId, status) => {
    setMarking({ ...marking, [studentId]: true });
    try {
      await mentorAPI.addAttendance({
        studentId,
        status,
        date: attendanceDate,
        remarks: '',
      });
      setMessage('Attendance marked successfully');
      setError('');
      // Reload attendance data for selected group
      if (selectedGroupId) {
        const summary = await mentorAPI.getGroupAttendanceSummary(selectedGroupId);
        setAttendanceSummaries({ ...attendanceSummaries, [selectedGroupId]: summary.data });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking({ ...marking, [studentId]: false });
    }
  };

  if (loading) return <LoadingSpinner />;

  const selectedGroup = groups.find(g => g._id === selectedGroupId);
  const selectedSummary = attendanceSummaries[selectedGroupId] || [];

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-sm text-slate-400 mt-1">Mark and view attendance for your groups.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Group Selection */}
        <Card className="card-glass">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <div className="space-y-2">
            {groups.length === 0 ? (
              <p className="text-slate-400">No groups available.</p>
            ) : (
              groups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => setSelectedGroupId(group._id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedGroupId === group._id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-xs">{group.department || 'N/A'}</p>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Attendance Marking */}
        <div className="lg:col-span-3">
          {selectedGroup ? (
            <>
              <Card className="card-glass mb-6">
                <h2 className="text-xl font-semibold mb-4">{selectedGroup.name}</h2>
                <Input
                  label="Attendance Date"
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedSummary.length === 0 ? (
                  <Card>
                    <p className="text-slate-400">No students in this group.</p>
                  </Card>
                ) : (
                  selectedSummary.map((item) => (
                    <Card key={item.studentId} className="card-glass">
                      <p className="text-white font-semibold">{item.studentName}</p>
                      <p className="text-slate-400 text-sm mb-3">Roll: {item.rollNumber}</p>
                      <p className="text-slate-400 text-xs mb-4">Present: {item.present}/{item.total} ({item.percentage}%)</p>
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => handleMarkAttendance(item.studentId, 'present')}
                          disabled={marking[item.studentId]}
                          className="flex-1 py-2 text-sm"
                        >
                          Present
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleMarkAttendance(item.studentId, 'absent')}
                          disabled={marking[item.studentId]}
                          className="flex-1 py-2 text-sm"
                        >
                          Absent
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => handleMarkAttendance(item.studentId, 'late')}
                          disabled={marking[item.studentId]}
                          className="flex-1 py-2 text-sm"
                        >
                          Late
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <Card>
              <p className="text-slate-400">Select a group to mark attendance.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorAttendance;
