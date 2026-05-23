const mongoose = require('mongoose');

const weeklyUpdateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  workProgress: {
    type: String,
    required: true,
  },
  percentageCompleted: {
    type: Number,
    min: 0,
    max: 100,
  },
  weeklySubmary: String,
  achievements: [String],
  challenges: [String],
  nextWeekPlan: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WeeklyUpdate', weeklyUpdateSchema);
