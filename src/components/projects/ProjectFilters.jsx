function ProjectFilters({ filters, onChange, onReset }) {
  return (
    <div className="surface-card p-4 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Search by title</label>
          <input name="search" className="form-control" value={filters.search} onChange={onChange} placeholder="Search project title" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Filter by status</label>
          <select name="status" className="form-select" value={filters.status} onChange={onChange}>
            <option value="">All statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Filter by student</label>
          <input name="studentName" className="form-control" value={filters.studentName} onChange={onChange} placeholder="Student name" />
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onReset}>Reset Filters</button>
      </div>
    </div>
  );
}

export default ProjectFilters;
