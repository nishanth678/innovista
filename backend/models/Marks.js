const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  evaluationType: {
    type: String,
    enum: ['internal', 'mentor_evaluation', 'progress'],
    required: true,
  },
  technicalSkills: {
    type: Number,
    min: 0,
    max: 10,
  },
  progress: {
    type: Number,
    min: 0,
    max: 10,
  },
  communication: {
    type: Number,
    min: 0,
    max: 10,
  },
  presentation: {
    type: Number,
    min: 0,
    max: 10,
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 40,
  },
  remarks: String,
  evaluatedAt: {
    type: Date,
    default: Date.now,
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

// Calculate total score before saving
marksSchema.pre('save', function(next) {
  const total = (this.technicalSkills || 0) + 
                (this.progress || 0) + 
                (this.communication || 0) + 
                (this.presentation || 0);
  this.totalScore = total;
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
