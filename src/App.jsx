import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import ProjectListPage from './pages/ProjectListPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/add" element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route index element={<ProjectFormPage mode="create" />} />
          </Route>
          <Route path="projects/:id/edit" element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
            <Route index element={<ProjectFormPage mode="edit" />} />
          </Route>
          <Route path="projects/:id" element={<ProjectDetailsPage />} />
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
