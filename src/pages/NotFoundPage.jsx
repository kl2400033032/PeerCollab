import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="auth-shell">
      <div className="surface-card p-5 text-center">
        <h1 className="page-title">Page Not Found</h1>
        <p className="text-secondary">The page you requested does not exist in PeerCollab.</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
