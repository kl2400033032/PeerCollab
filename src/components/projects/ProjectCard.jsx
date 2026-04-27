import { Link } from 'react-router-dom';
import StatusBadge from '../shared/StatusBadge';

function ProjectCard({ project, currentUser }) {
  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.email === project.studentEmail;

  return (
    <div className="project-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h5 className="fw-bold mb-1">{project.title}</h5>
          <div className="text-secondary">{project.studentName}</div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-secondary">{project.description}</p>

      <div className="small text-secondary mb-3">
        <div><strong>Reviews:</strong> {project.reviewCount}</div>
        <div><strong>Comments:</strong> {project.commentCount}</div>
        <div><strong>Average Rating:</strong> {project.averageRating ? project.averageRating.toFixed(1) : 'N/A'}</div>
      </div>

      <div className="d-flex flex-wrap gap-2">
        <Link className="btn btn-outline-primary btn-sm" to={`/projects/${project.id}`}>View</Link>
        {canEdit ? <Link className="btn btn-warning btn-sm text-white" to={`/projects/${project.id}/edit`}>Update</Link> : null}
      </div>
    </div>
  );
}

export default ProjectCard;
