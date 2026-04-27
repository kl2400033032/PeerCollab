function ReviewForm({ values, errors, onChange, onSubmit, isSubmitting }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Rating</label>
        <select name="rating" className={`form-select ${errors.rating ? 'is-invalid' : ''}`} value={values.rating} onChange={onChange}>
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
        <div className="invalid-feedback">{errors.rating}</div>
      </div>
      <div className="mb-3">
        <label className="form-label">Structured Feedback</label>
        <textarea name="feedback" rows="4" className={`form-control ${errors.feedback ? 'is-invalid' : ''}`} value={values.feedback} onChange={onChange} />
        <div className="invalid-feedback">{errors.feedback}</div>
      </div>
      <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Add Review'}</button>
    </form>
  );
}

export default ReviewForm;
