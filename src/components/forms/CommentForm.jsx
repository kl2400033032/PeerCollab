function CommentForm({ values, errors, onChange, onSubmit, isSubmitting }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Comment</label>
        <textarea name="message" rows="3" className={`form-control ${errors.message ? 'is-invalid' : ''}`} value={values.message} onChange={onChange} />
        <div className="invalid-feedback">{errors.message}</div>
      </div>
      <button className="btn btn-outline-primary" disabled={isSubmitting}>{isSubmitting ? 'Posting...' : 'Post Comment'}</button>
    </form>
  );
}

export default CommentForm;
