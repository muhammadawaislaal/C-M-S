import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddEditCourse from './pages/admin/AddEditCourse';
import AddLecture from './pages/admin/AddLecture';
import AdminCourses from './pages/admin/AdminCourses';
import AdminStudents from './pages/admin/AdminStudents';
import AdminGradeSubmission from './pages/admin/AdminGradeSubmission'
import AdminRegister from './pages/admin/AdminRegister';
import Analytics from './pages/admin/Analytics';
import Forum from './pages/admin/Forum';
import Messages from './pages/admin/Messages';
import Announcements from './pages/admin/Announcements';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAssessments from './pages/admin/AdminAssessments';
import LectureQuiz from './pages/student/LectureQuiz';

import StudentDashboard from './pages/student/StudentDashboard';
import LectureViewer from './pages/student/LectureViewer';
import StudentMyCourses from './pages/student/StudentMyCourses';
import StudentAllCourses from './pages/student/StudentAllCourses';
import StudentSettings from './pages/student/StudentSettings';
import StudentAchievements from './pages/student/StudentAchievements';

import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="register-user" element={<AdminRegister />} />
            <Route path="add-course" element={<AddEditCourse />} />
            <Route path="edit-course/:courseId" element={<AddEditCourse />} />
            <Route path="add-lecture/:courseId" element={<AddLecture />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="assessments/submission/:submissionId" element={<AdminGradeSubmission />} />
            <Route path="forums" element={<Forum />} />
            <Route path="messages" element={<Messages />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>


          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="my-courses" element={<StudentMyCourses />} />
            <Route path="courses" element={<StudentAllCourses />} />
            <Route path="course/:courseId" element={<LectureViewer />} />
            <Route path="quiz/:quizId" element={<LectureQuiz />} />
            <Route path="community" element={<Forum />} />
            <Route path="achievements" element={<StudentAchievements />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
