import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilters from '../components/projects/ProjectFilters';
import AlertMessage from '../components/shared/AlertMessage';
import EmptyState from '../components/shared/EmptyState';
import PaginationControls from '../components/shared/PaginationControls';
import SkeletonCard from '../components/shared/SkeletonCard';
import { useAuth } from '../contexts/useAuth';
import { getProjects } from '../services/projectService';
import { extractApiError } from '../utils/formUtils';

const initialFilters = { search: '', status: '', studentName: '' };

function ProjectListPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const data = await getProjects({ ...filters, page, size: 6 });
        setResult(data);
      } catch (error) {
        setFeedback({ variant: 'danger', title: 'Unable to load projects', ...extractApiError(error, 'Project list could not be loaded.') });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [filters, page]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPage(0);
    setFilters((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Project Directory</h1>
          <p className="text-secondary mb-0">Search, filter, and review submissions across the platform.</p>
        </div>
        {user.role === 'STUDENT' ? <Link className="btn btn-primary" to="/projects/add">Add Project</Link> : null}
      </div>

      {feedback ? <AlertMessage {...feedback} /> : null}

      <ProjectFilters filters={filters} onChange={handleChange} onReset={() => { setFilters(initialFilters); setPage(0); }} />

      {isLoading ? (
        <div className="row g-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <SkeletonCard lines={4} compact />
            </div>
          ))}
        </div>
      ) : !result?.content?.length ? (
        <EmptyState title="No projects found" description="Try adjusting the search and filter settings." />
      ) : (
        <>
          <div className="row g-4">
            {result.content.map((project) => (
              <div className="col-lg-4 col-md-6" key={project.id}>
                <ProjectCard project={project} currentUser={user} />
              </div>
            ))}
          </div>
          <PaginationControls page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default ProjectListPage;
