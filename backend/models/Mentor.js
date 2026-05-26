const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  department: String,
  specialization: String,
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mentor', mentorSchema);
