require('dotenv').config();
const connectDB = require('../config/database');
const mongoose = require('mongoose');

const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Group = require('../models/Group');
const { hashPassword } = require('../utils/passwordUtils');

const run = async () => {
  try {
    await connectDB();

    // Create batch
    let batch = await Batch.findOne({ name: 'Batch A' });
    if (!batch) {
      batch = await Batch.create({ name: 'Batch A', description: 'Seed batch A' });
    }

    // Create group
    let group = await Group.findOne({ name: 'Group 1' });
    if (!group) {
      group = await Group.create({ name: 'Group 1', department: 'CSE', batch: batch._id });
      await Batch.findByIdAndUpdate(batch._id, { $push: { groups: group._id } });
    }

    const created = {
      users: [],
      mentors: [],
      students: [],
    };

    // Admin
    const adminCred = { name: 'Admin User', email: 'admin@innovista.test', password: 'AdminPass123', role: 'admin' };
    let adminUser = await User.findOne({ email: adminCred.email });
    if (!adminUser) {
      const hp = await hashPassword(adminCred.password);
      adminUser = await User.create({ name: adminCred.name, email: adminCred.email, password: hp, role: 'admin' });
    }
    created.users.push({ email: adminUser.email, password: adminCred.password, role: 'admin' });

    // Mentors
    const mentors = [
      { name: 'Mentor One', email: 'mentor1@innovista.test', password: 'MentorPass1', employeeId: 'M1001', department: 'CSE' },
      { name: 'Mentor Two', email: 'mentor2@innovista.test', password: 'MentorPass2', employeeId: 'M1002', department: 'ECE' },
    ];

    for (const m of mentors) {
      let user = await User.findOne({ email: m.email });
      if (!user) {
        const hp = await hashPassword(m.password);
        user = await User.create({ name: m.name, email: m.email, password: hp, role: 'mentor', department: m.department });
      }

      let mentor = await Mentor.findOne({ user: user._id });
      if (!mentor) {
        mentor = await Mentor.create({ user: user._id, employeeId: m.employeeId, department: m.department, specialization: '' });
      }

      // assign to batch/group for Mentor One
      if (m.employeeId === 'M1001') {
        mentor = await Mentor.findByIdAndUpdate(mentor._id, { $addToSet: { batches: batch._id, groups: group._id } }, { new: true });
      }

      created.mentors.push({ email: user.email, password: m.password, employeeId: m.employeeId });
    }

    // Students
    const students = [
      { name: 'Alice Student', email: 'student1@innovista.test', password: 'StudentPass1', rollNumber: '1MV22CS001', department: 'CSE' },
      { name: 'Bob Student', email: 'student2@innovista.test', password: 'StudentPass2', rollNumber: '1MV22CS002', department: 'CSE' },
      { name: 'Carol Student', email: 'student3@innovista.test', password: 'StudentPass3', rollNumber: '1MV22EC001', department: 'ECE' },
    ];

    // Choose mentor for assignment
    const mentorOne = await Mentor.findOne({ employeeId: 'M1001' });
    const mentorTwo = await Mentor.findOne({ employeeId: 'M1002' });

    for (const s of students) {
      let user = await User.findOne({ email: s.email });
      if (!user) {
        const hp = await hashPassword(s.password);
        user = await User.create({ name: s.name, email: s.email, password: hp, role: 'student', department: s.department, batch: batch._id, group: group._id });
      }

      let student = await Student.findOne({ user: user._id });
      if (!student) {
        // choose mentor based on department
        const assignedMentor = s.department === 'CSE' ? mentorOne : mentorTwo;
        student = await Student.create({ user: user._id, rollNumber: s.rollNumber, department: s.department, batch: batch._id, group: group._id, mentor: assignedMentor ? assignedMentor._id : null });

        // add to group and batch and mentor
        await Group.findByIdAndUpdate(group._id, { $addToSet: { students: student._id } });
        await Batch.findByIdAndUpdate(batch._id, { $addToSet: { students: student._id } });
        if (assignedMentor) await Mentor.findByIdAndUpdate(assignedMentor._id, { $addToSet: { students: student._id } });
      }

      created.students.push({ email: user.email, password: s.password, rollNumber: s.rollNumber });
    }

    console.log('Seeding completed. Credentials:');
    console.table(created);

    // close connection
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

run();
