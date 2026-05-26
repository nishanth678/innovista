import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import DailyUpdates from './pages/DailyUpdates';
import WeeklyUpdates from './pages/WeeklyUpdates';
import StudentAttendance from './pages/StudentAttendance';
import StudentMarks from './pages/StudentMarks';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import MentorGroups from './pages/MentorGroups';
import MentorGroupDetails from './pages/MentorGroupDetails';
import MentorStudents from './pages/MentorStudents';
import MentorAttendance from './pages/MentorAttendance';
import MentorMarks from './pages/MentorMarks';
import AdminBatches from './pages/AdminBatches';
import AdminGroups from './pages/AdminGroups';
import AdminMentors from './pages/AdminMentors';
import AdminStudents from './pages/AdminStudents';
import AdminAnalytics from './pages/AdminAnalytics';
import ProjectUpdate from './pages/ProjectUpdate';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { LoadingSpinner } from './components/Common';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner message="Checking your session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex page-shell">
      <Sidebar />
      <div className="flex-1 flex flex-col main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner message="Loading application..." />
      </div>
    );
  }

  const homeRoute = isAuthenticated
    ? user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'mentor'
      ? '/mentor/dashboard'
      : '/student/dashboard'
    : '/login';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={homeRoute} />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/project"
        element={
          <ProtectedRoute requiredRole="student">
            <ProjectUpdate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/daily-updates"
        element={
          <ProtectedRoute requiredRole="student">
            <DailyUpdates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/weekly-updates"
        element={
          <ProtectedRoute requiredRole="student">
            <WeeklyUpdates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentMarks />
          </ProtectedRoute>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/groups"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/group/:groupId"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorGroupDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/students"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/attendance"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/marks"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorMarks />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/batches"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminBatches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/groups"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/mentors"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminMentors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={homeRoute} />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;