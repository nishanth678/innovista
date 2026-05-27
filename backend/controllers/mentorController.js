const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Group = require('../models/Group');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const DailyUpdate = require('../models/DailyUpdate');
const WeeklyUpdate = require('../models/WeeklyUpdate');
const User = require('../models/User');

// Get Mentor Dashboard
exports.getMentorDashboard = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.userId })
      .populate('user')
      .populate('groups')
      .populate('students');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor record not found' });
    }

    // Get pending updates
    const dailyUpdates = await DailyUpdate.countDocuments({ 
      student: { $in: mentor.students } 
    });

    const weeklyUpdates = await WeeklyUpdate.countDocuments({ 
      student: { $in: mentor.students } 
    });

    const dashboard = {
      mentor: {
        id: mentor._id,
        name: mentor.user.name,
        email: mentor.user.email,
        employeeId: mentor.employeeId,
        department: mentor.department,
      },
      statistics: {
        totalGroups: mentor.groups.length,
        totalStudents: mentor.students.length,
        pendingDailyUpdates: dailyUpdates,
        pendingWeeklyUpdates: weeklyUpdates,
      },
      recentGroups: mentor.groups.slice(0, 5),
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Assigned Groups
exports.getAssignedGroups = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    let groups = [];

    if (mentor.groups?.length > 0) {
      groups = await Group.find({ _id: { $in: mentor.groups } })
        .populate('students')
        .populate('project');
    }

    if (groups.length === 0) {
      groups = await Group.find({ mentor: mentor._id })
        .populate('students')
        .populate('project');
    }

    if (groups.length === 0) {
      const studentGroupIds = await Student.find({ mentor: mentor._id }).distinct('group');
      groups = await Group.find({ _id: { $in: studentGroupIds } })
        .populate('students')
        .populate('project');
    }

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Group Details with Students
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate({
        path: 'students',
        populate: 'user'
      })
      .populate('project')
      .populate('mentor');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Details
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('user')
      .populate('batch')
      .populate('group')
      .populate('project');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get attendance
    const attendance = await Attendance.find({ student: student._id });
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = attendance.length ? Math.round(((presentCount) / attendance.length) * 100) : 0;

    // Get marks
    const marks = await Marks.find({ student: student._id });

    const details = {
      student,
      attendance: {
        total: attendance.length,
        present: presentCount,
        percentage: attendancePercentage,
      },
      marks,
    };

    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Daily Updates
exports.getStudentDailyUpdates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const updates = await DailyUpdate.find({ student: studentId })
      .sort({ date: -1 });

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Weekly Updates
exports.getStudentWeeklyUpdates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const updates = await WeeklyUpdate.find({ student: studentId })
      .sort({ year: -1, week: -1 });

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Attendance
exports.addAttendance = async (req, res) => {
  try {
    const { studentId, status, date, remarks } = req.body;

    if (!['present', 'absent', 'late'].includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const attendance = new Attendance({
      student: studentId,
      date: date || new Date(),
      status,
      remarks,
      markedBy: mentor._id,
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Give Marks
exports.giveMarks = async (req, res) => {
  try {
    const { studentId, evaluationType, technicalSkills, progress, communication, presentation, remarks } = req.body;

    if (!['internal', 'mentor_evaluation', 'progress'].includes(evaluationType)) {
      return res.status(400).json({ message: 'Invalid evaluation type' });
    }

    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const marks = new Marks({
      student: studentId,
      mentor: mentor._id,
      evaluationType,
      technicalSkills,
      progress,
      communication,
      presentation,
      remarks,
    });

    await marks.save();

    res.status(201).json({
      message: 'Marks recorded successfully',
      marks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Group Attendance Summary
exports.getGroupAttendanceSummary = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('students');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const attendanceData = [];

    for (const student of group.students) {
      const attendance = await Attendance.find({ student: student._id });
      const presentCount = attendance.filter(a => a.status === 'present').length;
      const percentage = attendance.length ? Math.round(((presentCount) / attendance.length) * 100) : 0;

      attendanceData.push({
        studentId: student._id,
        studentName: student.user?.name || 'Student',
        rollNumber: student.rollNumber,
        total: attendance.length,
        present: presentCount,
        percentage,
      });
    }

    res.json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Students
exports.searchStudents = async (req, res) => {
  try {
    const { query, department } = req.query;

    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    let students = await Student.find({ mentor: mentor._id })
      .populate('user')
      .populate('batch')
      .populate('group');

    if (department) {
      students = students.filter((student) => student.department?.toLowerCase() === department.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      students = students.filter((student) => {
        const name = student.user?.name?.toLowerCase() || '';
        const roll = student.rollNumber?.toLowerCase() || '';
        return name.includes(q) || roll.includes(q);
      });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
