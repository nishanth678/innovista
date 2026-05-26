const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Batch = require('../models/Batch');
const Group = require('../models/Group');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const { hashPassword } = require('../utils/passwordUtils');

// Get Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalMentors = await Mentor.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalBatches = await Batch.countDocuments();

    // Attendance statistics
    const attendance = await Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Project progress statistics
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const dashboard = {
      statistics: {
        totalStudents,
        totalMentors,
        totalGroups,
        totalBatches,
      },
      attendanceStats: attendance,
      projectStats,
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Batch
exports.createBatch = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Batch name is required' });
    }

    const existingBatch = await Batch.findOne({ name });
    if (existingBatch) {
      return res.status(400).json({ message: 'Batch already exists' });
    }

    const batch = new Batch({
      name,
      description,
      startDate,
      endDate,
    });

    await batch.save();

    res.status(201).json({
      message: 'Batch created successfully',
      batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('mentor')
      .populate('groups')
      .populate('students');

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Batch
exports.updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { name, description, startDate, endDate } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { name, description, startDate, endDate, updatedAt: new Date() },
      { new: true }
    );

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json({
      message: 'Batch updated successfully',
      batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Batch
exports.deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await Batch.findByIdAndDelete(batchId);
    await Group.updateMany({ batch: batchId }, { $unset: { batch: '' } });
    await Student.updateMany({ batch: batchId }, { $unset: { batch: '' } });
    await Mentor.updateMany({ batches: batchId }, { $pull: { batches: batchId } });
    await User.updateMany({ batch: batchId }, { $unset: { batch: '' } });

    res.json({
      message: 'Batch deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Group
exports.createGroup = async (req, res) => {
  try {
    const { name, department, batchId } = req.body;

    if (!name || !department || !batchId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const group = new Group({
      name,
      department,
      batch: batchId,
    });

    await group.save();

    // Add group to batch
    await Batch.findByIdAndUpdate(
      batchId,
      { $push: { groups: group._id } },
      { new: true }
    );

    res.status(201).json({
      message: 'Group created successfully',
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('batch')
      .populate('mentor')
      .populate('students')
      .populate('project');

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Group
exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, department } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, department, updatedAt: new Date() },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({
      message: 'Group updated successfully',
      group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Group
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByIdAndDelete(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Remove group from batch
    await Batch.findByIdAndUpdate(
      group.batch,
      { $pull: { groups: groupId } }
    );

    res.json({
      message: 'Group deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Mentor
exports.createMentor = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, specialization } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'mentor',
      department,
    });

    await user.save();

    // Create mentor
    const mentor = new Mentor({
      user: user._id,
      employeeId,
      department,
      specialization,
    });

    await mentor.save();

    res.status(201).json({
      message: 'Mentor created successfully',
      mentor: {
        id: mentor._id,
        name: user.name,
        email: user.email,
        employeeId,
        department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Mentors
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('user')
      .populate('batches')
      .populate('groups')
      .populate('students');

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Mentor
exports.updateMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { name, phone, department, specialization } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Update user info
    await User.findByIdAndUpdate(
      mentor.user,
      { name, phone, department, updatedAt: new Date() }
    );

    // Update mentor info
    const updated = await Mentor.findByIdAndUpdate(
      mentorId,
      { department, specialization, updatedAt: new Date() },
      { new: true }
    ).populate('user');

    res.json({
      message: 'Mentor updated successfully',
      mentor: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Mentor
exports.deleteMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    await Mentor.findByIdAndDelete(mentorId);

    // Remove mentor references from batches, students, and groups
    await Batch.updateMany({ mentor: mentorId }, { $unset: { mentor: '' } });
    await Student.updateMany({ mentor: mentorId }, { $unset: { mentor: '' } });
    await Group.updateMany({ mentor: mentorId }, { $unset: { mentor: '' } });

    // Delete associated user
    await User.findByIdAndDelete(mentor.user);

    res.json({
      message: 'Mentor deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Mentor to Batches
exports.assignMentorToBatches = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { batchIds } = req.body;

    if (!mentorId || !batchIds || !Array.isArray(batchIds) || batchIds.length === 0) {
      return res.status(400).json({ message: 'Mentor and batches are required' });
    }

    if (batchIds.length > 10) {
      return res.status(400).json({ message: 'A mentor can handle a maximum of 10 batches' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const previousBatchIds = mentor.batches.map((id) => id.toString());
    const newBatchIds = batchIds.map((id) => id.toString());
    const removedBatchIds = previousBatchIds.filter((id) => !newBatchIds.includes(id));

    if (removedBatchIds.length > 0) {
      await Batch.updateMany(
        { _id: { $in: removedBatchIds }, mentor: mentorId },
        { $unset: { mentor: '' } }
      );
    }

    await Batch.updateMany({ _id: { $in: newBatchIds } }, { mentor: mentorId });

    mentor.batches = newBatchIds;
    await mentor.save();

    const updatedMentor = await Mentor.findById(mentorId).populate('batches');

    res.json({
      message: 'Mentor assigned to batches successfully',
      mentor: updatedMentor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, batchId, groupId, mentorId } = req.body;

    if (!name || !email || !password || !rollNumber || !department || !batchId || !groupId || !mentorId) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const batch = await Batch.findById(batchId);
    const group = await Group.findById(groupId);
    const mentor = await Mentor.findById(mentorId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      department,
      batch: batchId,
      group: groupId,
    });

    await user.save();

    try {
      const student = new Student({
        user: user._id,
        rollNumber,
        department,
        batch: batchId,
        group: groupId,
        mentor: mentorId,
      });

      await student.save();

      // Add student to group
      await Group.findByIdAndUpdate(groupId, { $addToSet: { students: student._id } });

      // Add student to batch
      await Batch.findByIdAndUpdate(batchId, { $addToSet: { students: student._id } });

      // Add student to mentor
      await Mentor.findByIdAndUpdate(mentorId, { $addToSet: { students: student._id } });

      res.status(201).json({
        message: 'Student added successfully',
        student: {
          id: student._id,
          name: user.name,
          email: user.email,
          rollNumber,
        },
      });
    } catch (innerError) {
      await User.findByIdAndDelete(user._id);
      throw innerError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const { department, batch } = req.query;

    let criteria = {};
    if (department) criteria.department = department;
    if (batch) criteria.batch = batch;

    const students = await Student.find(criteria)
      .populate('user')
      .populate('batch')
      .populate('group')
      .populate('mentor');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, phone, department, batchId, groupId, mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updates = { name, phone, department, updatedAt: new Date() };
    const studentUpdates = {
      department,
      updatedAt: new Date(),
    };

    if (batchId) studentUpdates.batch = batchId;
    if (groupId) studentUpdates.group = groupId;
    if (mentorId) studentUpdates.mentor = mentorId;

    // Update user
    await User.findByIdAndUpdate(
      student.user,
      {
        name,
        phone,
        department,
        batch: batchId || student.batch,
        group: groupId || student.group,
        mentor: mentorId || student.mentor,
        updatedAt: new Date(),
      }
    );

    // Update batch membership if changed
    const prevBatchId = student.batch ? student.batch.toString() : null;
    if (batchId && (!prevBatchId || batchId.toString() !== prevBatchId)) {
      if (prevBatchId) await Batch.findByIdAndUpdate(prevBatchId, { $pull: { students: student._id } });
      await Batch.findByIdAndUpdate(batchId, { $addToSet: { students: student._id } });
    }

    // Update group membership if changed
    const prevGroupId = student.group ? student.group.toString() : null;
    if (groupId && (!prevGroupId || groupId.toString() !== prevGroupId)) {
      if (prevGroupId) await Group.findByIdAndUpdate(prevGroupId, { $pull: { students: student._id } });
      await Group.findByIdAndUpdate(groupId, { $addToSet: { students: student._id } });
    }

    // Update mentor assignment if changed
    const prevMentorId = student.mentor ? student.mentor.toString() : null;
    if (mentorId && (!prevMentorId || mentorId.toString() !== prevMentorId)) {
      if (prevMentorId) await Mentor.findByIdAndUpdate(prevMentorId, { $pull: { students: student._id } });
      await Mentor.findByIdAndUpdate(mentorId, { $addToSet: { students: student._id } });
    }

    const updated = await Student.findByIdAndUpdate(
      studentId,
      studentUpdates,
      { new: true }
    ).populate('user');

    res.json({
      message: 'Student updated successfully',
      student: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(studentId);
    await User.findByIdAndDelete(student.user);
    await Batch.findByIdAndUpdate(student.batch, { $pull: { students: studentId } });
    await Group.findByIdAndUpdate(student.group, { $pull: { students: studentId } });
    await Mentor.findByIdAndUpdate(student.mentor, { $pull: { students: studentId } });

    res.json({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = {
      totalStudents: await Student.countDocuments(),
      totalMentors: await Mentor.countDocuments(),
      totalGroups: await Group.countDocuments(),
      totalBatches: await Batch.countDocuments(),
      attendanceStats: await Attendance.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      projectStats: await Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
