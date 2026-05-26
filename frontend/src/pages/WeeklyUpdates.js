import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Card, Button, TextArea, LoadingSpinner, Alert, Input } from '../components/Common';

const WeeklyUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    week: new Date().getWeek(),
    year: new Date().getFullYear(),
    workProgress: '',
    percentageCompleted: 0,
    weeklySubmary: '',
    achievements: '',
    challenges: '',
    nextWeekPlan: '',
  });

  // Add getWeek helper
  Date.prototype.getWeek = function () {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const diff = date - yearStart;
    const oneMs = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneMs / 7) + 1;
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await studentAPI.getWeeklyUpdates();
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
      await studentAPI.submitWeeklyUpdate({
        ...formData,
        achievements: formData.achievements.split(',').map(a => a.trim()),
        challenges: formData.challenges.split(',').map(c => c.trim()),
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
        <h1 className="text-3xl font-bold">Weekly Updates</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Update'}
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Submit Weekly Update</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Week Number"
                type="number"
                value={formData.week}
                onChange={(e) => setFormData({...formData, week: parseInt(e.target.value)})}
                required
              />
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                required
              />
            </div>
            <TextArea
              label="Work Progress"
              placeholder="Describe overall work progress..."
              value={formData.workProgress}
              onChange={(e) => setFormData({...formData, workProgress: e.target.value})}
              required
            />
            <Input
              label="Percentage Completed (%)"
              type="number"
              min="0"
              max="100"
              value={formData.percentageCompleted}
              onChange={(e) => setFormData({...formData, percentageCompleted: parseInt(e.target.value)})}
            />
            <TextArea
              label="Weekly Summary"
              placeholder="Summary of the week..."
              value={formData.weeklySubmary}
              onChange={(e) => setFormData({...formData, weeklySubmary: e.target.value})}
            />
            <TextArea
              label="Achievements (comma separated)"
              placeholder="Major achievements this week..."
              value={formData.achievements}
              onChange={(e) => setFormData({...formData, achievements: e.target.value})}
            />
            <TextArea
              label="Challenges (comma separated)"
              placeholder="Challenges faced..."
              value={formData.challenges}
              onChange={(e) => setFormData({...formData, challenges: e.target.value})}
            />
            <TextArea
              label="Next Week Plan"
              placeholder="Plan for next week..."
              value={formData.nextWeekPlan}
              onChange={(e) => setFormData({...formData, nextWeekPlan: e.target.value})}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <Alert type="info" message="No weekly updates yet." />
        ) : (
          updates.map((update) => (
            <Card key={update._id}>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Week {update.week}, {update.year}
                </p>
                <p className="text-lg font-bold">{update.workProgress}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${update.percentageCompleted}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{update.percentageCompleted}%</p>
                </div>
              </div>
              {update.achievements?.length > 0 && (
                <>
                  <p className="text-sm font-semibold text-gray-700 mt-4">Achievements</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {update.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyUpdates;
