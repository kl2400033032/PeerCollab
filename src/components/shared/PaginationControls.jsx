function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
      <button className="btn btn-outline-primary" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span className="filter-chip">
        Page {page + 1} of {totalPages}
      </span>
      <button className="btn btn-outline-primary" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default PaginationControls;
