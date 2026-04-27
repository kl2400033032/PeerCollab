import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import AssignmentForm from '../components/forms/AssignmentForm';
import StatsCard from '../components/dashboard/StatsCard';
import AlertMessage from '../components/shared/AlertMessage';
import EmptyState from '../components/shared/EmptyState';
import SkeletonCard from '../components/shared/SkeletonCard';
import { useAuth } from '../contexts/useAuth';
import { createAssignment, getAssignments, getMyAssignments } from '../services/assignmentService';
import { getActivity } from '../services/activityService';
import { getAdminAnalytics } from '../services/analyticsService';
import { getAdminDashboard, getStudentDashboard } from '../services/dashboardService';
import { getMyProjects, getProjects } from '../services/projectService';
import { getStudents } from '../services/userService';
import { extractApiError, validateAssignmentForm } from '../utils/formUtils';

const initialAssignment = { title: '', description: '', dueDate: '', assignedStudentId: '' };
const chartColors = ['#0d6efd', '#12b886', '#ff922b', '#7048e8'];

function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentValues, setAssignmentValues] = useState(initialAssignment);
  const [assignmentErrors, setAssignmentErrors] = useState({});
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const safeDashboard = dashboard || {
    totalProjects: 0,
    completedReviews: 0,
    pendingReviews: 0,
  };
  const safeAnalytics = analytics || {
    reviewCompletionRate: 0,
    projectsPerStudent: [],
    projectStatusBreakdown: [],
    recentActivities: [],
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const activityPromise = getActivity({ page: 0, size: 6 });

        if (user.role === 'ADMIN') {
          const [stats, assignmentData, studentData, projectData, analyticsData, activityData] = await Promise.all([
            getAdminDashboard(),
            getAssignments(),
            getStudents(),
            getProjects({ page: 0, size: 5 }),
            getAdminAnalytics(),
            activityPromise,
          ]);
          setDashboard(stats);
          setAssignments(assignmentData);
          setStudents(studentData);
          setProjects(projectData.content);
          setAnalytics(analyticsData);
          setActivities(analyticsData.recentActivities?.length ? analyticsData.recentActivities : activityData.content);
        } else {
          const [stats, assignmentData, projectData, activityData] = await Promise.all([
            getStudentDashboard(),
            getMyAssignments(),
            getMyProjects(),
            activityPromise,
          ]);
          setDashboard(stats);
          setAssignments(assignmentData);
          setProjects(projectData.slice(0, 5));
          setActivities(activityData.content);
        }
      } catch (error) {
        setFeedback({ variant: 'danger', title: 'Dashboard error', ...extractApiError(error, 'Unable to load dashboard.') });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setAssignmentValues((current) => ({ ...current, [name]: value }));
    setAssignmentErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateAssignmentForm(assignmentValues);
    if (Object.keys(validationErrors).length > 0) {
      setAssignmentErrors(validationErrors);
      return;
    }

    setIsSubmittingAssignment(true);
    try {
      const created = await createAssignment({
        ...assignmentValues,
        assignedStudentId: Number(assignmentValues.assignedStudentId),
      });
      setAssignments((current) => [created, ...current]);
      setAssignmentValues(initialAssignment);
      setFeedback({ variant: 'success', title: 'Assignment created', message: 'The assignment has been assigned successfully.' });
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Assignment failed', ...extractApiError(error, 'Unable to create assignment.') });
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4"><SkeletonCard lines={2} compact /></div>
          <div className="col-md-4"><SkeletonCard lines={2} compact /></div>
          <div className="col-md-4"><SkeletonCard lines={2} compact /></div>
          <div className="col-lg-6"><SkeletonCard lines={6} compact /></div>
          <div className="col-lg-6"><SkeletonCard lines={6} compact /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <div className="soft-label">{user.role === 'ADMIN' ? 'Teacher Control Center' : 'Student Workspace'}</div>
          <h1 className="page-title mb-1">Welcome, {user.name}</h1>
          <p className="text-secondary mb-0">
            {user.role === 'ADMIN'
              ? 'Monitor engagement, assignment delivery, and review completion with real-time platform insights.'
              : 'Manage your submissions, stay on top of feedback, and collaborate in one place.'}
          </p>
        </div>
        <div className="filter-chip">{user.email}</div>
      </div>

      {feedback ? <AlertMessage {...feedback} /> : null}

      <div className="row g-4 mb-4">
        <div className="col-md-4"><StatsCard title="Total Projects" value={safeDashboard.totalProjects} /></div>
        <div className="col-md-4"><StatsCard title="Completed Reviews" value={safeDashboard.completedReviews} accent="success" /></div>
        <div className="col-md-4"><StatsCard title="Pending Reviews" value={safeDashboard.pendingReviews} accent="warning" /></div>
      </div>

      {user.role === 'ADMIN' ? (
        <div className="row g-4">
          <div className="col-xl-4">
            <div className="surface-card p-4 h-100">
              <h4 className="page-title fs-4">Create Assignment</h4>
              <p className="text-secondary">Assign academic project work and notify students instantly.</p>
              <AssignmentForm
                values={assignmentValues}
                errors={assignmentErrors}
                onChange={handleAssignmentChange}
                onSubmit={handleAssignmentSubmit}
                students={students}
                isSubmitting={isSubmittingAssignment}
              />
            </div>
          </div>
          <div className="col-xl-8">
            <div className="surface-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="page-title fs-4 mb-0">Platform Analytics</h4>
                <span className="filter-chip">{safeAnalytics.reviewCompletionRate.toFixed(1)}% review completion</span>
              </div>
              <div className="row g-4">
                <div className="col-lg-7">
                  <div className="chart-panel">
                    <div className="soft-label mb-2">Projects per Student</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={safeAnalytics.projectsPerStudent}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0d6efd" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="chart-panel">
                    <div className="soft-label mb-2">Project Status Breakdown</div>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={safeAnalytics.projectStatusBreakdown} dataKey="value" nameKey="label" outerRadius={90}>
                          {safeAnalytics.projectStatusBreakdown.map((entry, index) => (
                            <Cell key={entry.label} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="surface-card p-4 h-100">
              <h4 className="page-title fs-4">Assignment Monitor</h4>
              <p className="text-secondary">Track assignment ownership and whether a project has been linked.</p>
              {assignments.length === 0 ? (
                <EmptyState title="No assignments yet" description="Create the first assignment to start monitoring progress." />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="feed-card p-3">
                      <div className="fw-bold">{assignment.title}</div>
                      <div className="text-secondary small">Assigned to {assignment.assignedStudentName} · Due {assignment.dueDate}</div>
                      <div className="small mt-2">
                        {assignment.linkedProjectId ? `Linked project ID: ${assignment.linkedProjectId}` : 'Project not yet submitted'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="surface-card p-4 h-100">
              <h4 className="page-title fs-4">Recent Activity</h4>
              <ActivityFeed activities={activities} />
            </div>
          </div>

          <div className="col-12">
            <div className="surface-card p-4">
              <h4 className="page-title fs-4">Recent Submissions</h4>
              {projects.length === 0 ? (
                <EmptyState title="No submissions yet" description="Student project submissions will appear here." />
              ) : (
                <div className="row g-3">
                  {projects.map((project) => (
                    <div key={project.id} className="col-md-6 col-xl-4">
                      <div className="feed-card p-3 h-100">
                        <div className="fw-bold">{project.title}</div>
                        <div className="text-secondary small">{project.studentName}</div>
                        <div className="small mt-2">Reviews: {project.reviewCount} · Status: {project.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="surface-card p-4 h-100">
              <h4 className="page-title fs-4">My Assignments</h4>
              {assignments.length === 0 ? (
                <EmptyState title="No assignments" description="Your teacher-created assignments will appear here." />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="feed-card p-3">
                      <div className="fw-bold">{assignment.title}</div>
                      <div className="text-secondary small">Due {assignment.dueDate}</div>
                      <div className="small mt-2">{assignment.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="surface-card p-4 h-100">
              <h4 className="page-title fs-4">My Activity</h4>
              <ActivityFeed activities={activities} />
            </div>
          </div>
          <div className="col-12">
            <div className="surface-card p-4">
              <h4 className="page-title fs-4">My Projects</h4>
              {projects.length === 0 ? (
                <EmptyState title="No projects submitted" description="Create your first project submission from the Projects section." />
              ) : (
                <div className="row g-3">
                  {projects.map((project) => (
                    <div key={project.id} className="col-md-6 col-xl-4">
                      <div className="feed-card p-3 h-100">
                        <div className="fw-bold">{project.title}</div>
                        <div className="text-secondary small">{project.status} · Reviews {project.reviewCount}</div>
                        <div className="small mt-2">{project.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
