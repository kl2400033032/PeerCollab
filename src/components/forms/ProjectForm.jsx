function ProjectForm({
  values,
  errors,
  onChange,
  onSubmit,
  onFileChange,
  selectedFileName,
  assignments = [],
  submitLabel,
  isSubmitting,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={values.title} onChange={onChange} />
          <div className="invalid-feedback">{errors.title}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select name="status" className={`form-select ${errors.status ? 'is-invalid' : ''}`} value={values.status} onChange={onChange}>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <div className="invalid-feedback">{errors.status}</div>
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea name="description" rows="5" className={`form-control ${errors.description ? 'is-invalid' : ''}`} value={values.description} onChange={onChange} />
          <div className="invalid-feedback">{errors.description}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Assignment</label>
          <select name="assignmentId" className="form-select" value={values.assignmentId} onChange={onChange}>
            <option value="">No linked assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>{assignment.title} - {assignment.assignedStudentName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Project File (PDF or ZIP)</label>
          <input className={`form-control ${errors.file ? 'is-invalid' : ''}`} type="file" accept=".pdf,.zip,application/pdf,application/zip" onChange={onFileChange} />
          <div className="invalid-feedback">{errors.file}</div>
          <div className="small text-secondary mt-2">{selectedFileName || 'Optional upload, max 10 MB.'}</div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : submitLabel}</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ProjectForm;
