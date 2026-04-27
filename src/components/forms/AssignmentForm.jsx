function AssignmentForm({ values, errors, onChange, onSubmit, students, isSubmitting }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Assignment Title</label>
          <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={values.title} onChange={onChange} />
          <div className="invalid-feedback">{errors.title}</div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Due Date</label>
          <input name="dueDate" type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} value={values.dueDate} onChange={onChange} />
          <div className="invalid-feedback">{errors.dueDate}</div>
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea name="description" rows="3" className={`form-control ${errors.description ? 'is-invalid' : ''}`} value={values.description} onChange={onChange} />
          <div className="invalid-feedback">{errors.description}</div>
        </div>
        <div className="col-12">
          <label className="form-label">Assign Student</label>
          <select name="assignedStudentId" className={`form-select ${errors.assignedStudentId ? 'is-invalid' : ''}`} value={values.assignedStudentId} onChange={onChange}>
            <option value="">Choose student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.assignedStudentId}</div>
        </div>
      </div>
      <button className="btn btn-primary mt-3" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Assignment'}</button>
    </form>
  );
}

export default AssignmentForm;
