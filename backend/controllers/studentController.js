const Student = require('../models/Student');
const User = require('../models/User');
const Project = require('../models/Project');
const DailyUpdate = require('../models/DailyUpdate');
const WeeklyUpdate = require('../models/WeeklyUpdate');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// Get Student Dashboard
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId })
      .populate('user')
      .populate('batch')
      .populate('group')
      .populate('mentor', 'user')
      .populate('project');

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    // Get attendance stats
    const attendanceRecords = await Attendance.find({ student: student._id });
    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
    const totalDays = attendanceRecords.length;
    const attendancePercentage = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

    // Get marks
    const marks = await Marks.find({ student: student._id });

    const dashboard = {
      student: {
        id: student._id,
        name: student.user.name,
        email: student.user.email,
        rollNumber: student.rollNumber,
        department: student.department,
        batch: student.batch?.name,
        group: student.group?.name,
      },
      mentor: student.mentor ? {
        name: student.mentor.user?.name,
        email: student.mentor.user?.email,
      } : null,
      guide: student.guide,
      project: student.project ? {
        title: student.project.title,
        status: student.project.status,
        progressPercentage: student.project.progressPercentage,
        technologies: student.project.technologies,
      } : null,
      attendance: {
        presentDays,
        totalDays,
        percentage: attendancePercentage,
      },
      marks: {
        internal: marks.find(m => m.evaluationType === 'internal')?.totalScore || 0,
        mentorEvaluation: marks.find(m => m.evaluationType === 'mentor_evaluation')?.totalScore || 0,
        progress: marks.find(m => m.evaluationType === 'progress')?.totalScore || 0,
      },
      updatesCount: {
        daily: await DailyUpdate.countDocuments({ student: student._id }),
        weekly: await WeeklyUpdate.countDocuments({ student: student._id }),
      },
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId })
      .populate('user')
      .populate('batch')
      .populate('group')
      .populate('mentor')
      .populate('project');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Daily Update
exports.submitDailyUpdate = async (req, res) => {
  try {
    const { workCompleted, issuesFaced, nextTask, statusCode } = req.body;

    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const update = new DailyUpdate({
      student: student._id,
      date: new Date(),
      workCompleted,
      issuesFaced,
      nextTask,
      statusCode: statusCode || 'on-track',
    });

    await update.save();

    res.status(201).json({
      message: 'Daily update submitted successfully',
      update,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Daily Updates
exports.getDailyUpdates = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updates = await DailyUpdate.find({ student: student._id })
      .sort({ date: -1 })
      .limit(30);

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Weekly Update
exports.submitWeeklyUpdate = async (req, res) => {
  try {
    const { week, year, workProgress, percentageCompleted, weeklySubmary, achievements, challenges, nextWeekPlan } = req.body;

    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const update = new WeeklyUpdate({
      student: student._id,
      week,
      year,
      workProgress,
      percentageCompleted,
      weeklySubmary,
      achievements,
      challenges,
      nextWeekPlan,
    });

    await update.save();

    res.status(201).json({
      message: 'Weekly update submitted successfully',
      update,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Weekly Updates
exports.getWeeklyUpdates = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updates = await WeeklyUpdate.find({ student: student._id })
      .sort({ year: -1, week: -1 });

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Attendance
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = await Attendance.find({ student: student._id })
      .sort({ date: -1 });

    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;

    res.json({
      attendance,
      summary: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        total: attendance.length,
        percentage: attendance.length ? Math.round(((presentCount + lateCount) / attendance.length) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Marks
exports.getMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const marks = await Marks.find({ student: student._id });

    res.json({
      marks,
      summary: {
        internal: marks.find(m => m.evaluationType === 'internal')?.totalScore || 0,
        mentorEvaluation: marks.find(m => m.evaluationType === 'mentor_evaluation')?.totalScore || 0,
        progress: marks.find(m => m.evaluationType === 'progress')?.totalScore || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
