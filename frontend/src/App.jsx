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
import AdminRegister from './pages/admin/AdminRegister';

import StudentDashboard from './pages/student/StudentDashboard';
import LectureViewer from './pages/student/LectureViewer';
import StudentMyCourses from './pages/student/StudentMyCourses';
import StudentAllCourses from './pages/student/StudentAllCourses';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
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
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="my-courses" element={<StudentMyCourses />} />
            <Route path="courses" element={<StudentAllCourses />} />
            <Route path="course/:courseId" element={<LectureViewer />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
