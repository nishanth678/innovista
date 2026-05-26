require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('../models/Student');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/innovista_idt';

const run = async () => {
  try {
    console.log('Connecting to', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    console.log('\nRecent students (up to 20):');
    const students = await Student.find().populate('user').sort({ createdAt: -1 }).limit(20);
    students.forEach((s) => {
      console.log('---');
      console.log('StudentId:', s._id.toString());
      console.log('Name:', s.user?.name);
      console.log('Email:', s.user?.email);
      console.log('Roll:', s.rollNumber);
      console.log('Batch:', s.batch?.toString());
      console.log('Group:', s.group?.toString());
      console.log('Mentor:', s.mentor?.toString());
      console.log('CreatedAt:', s.createdAt);
    });

    console.log('\nRecent User accounts with role=student (up to 20):');
    const users = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(20);
    users.forEach((u) => {
      console.log('---');
      console.log('UserId:', u._id.toString());
      console.log('Name:', u.name);
      console.log('Email:', u.email);
      console.log('Batch:', u.batch || '');
      console.log('CreatedAt:', u.createdAt);
    });

    await mongoose.disconnect();
    console.log('\nDone');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
