const mongoose = require('mongoose');

const dailyUpdateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  workCompleted: {
    type: String,
    required: true,
  },
  issuesFaced: String,
  nextTask: String,
  statusCode: {
    type: String,
    enum: ['on-track', 'delayed', 'blocked'],
    default: 'on-track',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DailyUpdate', dailyUpdateSchema);
