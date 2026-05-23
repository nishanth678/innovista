import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Card, Button, TextArea, LoadingSpinner, Alert, Input } from '../components/Common';

const DailyUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workCompleted: '',
    issuesFaced: '',
    nextTask: '',
    statusCode: 'on-track',
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await studentAPI.getDailyUpdates();
      setUpdates(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.submitDailyUpdate(formData);
      setFormData({
        workCompleted: '',
        issuesFaced: '',
        nextTask: '',
        statusCode: 'on-track',
      });
      setShowForm(false);
      await fetchUpdates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit update');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Daily Updates</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Update'}
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Submit Daily Update</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextArea
              label="Work Completed"
              placeholder="Describe the work completed today..."
              value={formData.workCompleted}
              onChange={(e) => setFormData({...formData, workCompleted: e.target.value})}
              required
            />
            <TextArea
              label="Issues Faced"
              placeholder="Any issues encountered..."
              value={formData.issuesFaced}
              onChange={(e) => setFormData({...formData, issuesFaced: e.target.value})}
            />
            <TextArea
              label="Next Task"
              placeholder="What's planned for next..."
              value={formData.nextTask}
              onChange={(e) => setFormData({...formData, nextTask: e.target.value})}
            />
            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.statusCode}
                onChange={(e) => setFormData({...formData, statusCode: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="on-track">On Track</option>
                <option value="delayed">Delayed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <Alert type="info" message="No updates yet. Submit your first daily update!" />
        ) : (
          updates.map((update) => (
            <Card key={update._id}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-600">
                  {new Date(update.date).toLocaleDateString()}
                </p>
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${update.statusCode === 'on-track' ? 'bg-green-100 text-green-800' :
                    update.statusCode === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {update.statusCode}
                </span>
              </div>
              <h3 className="font-bold mb-2">Work Completed</h3>
              <p className="text-gray-700 mb-4">{update.workCompleted}</p>
              {update.issuesFaced && (
                <>
                  <h3 className="font-bold mb-2">Issues Faced</h3>
                  <p className="text-gray-700 mb-4">{update.issuesFaced}</p>
                </>
              )}
              {update.nextTask && (
                <>
                  <h3 className="font-bold mb-2">Next Task</h3>
                  <p className="text-gray-700">{update.nextTask}</p>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyUpdates;
