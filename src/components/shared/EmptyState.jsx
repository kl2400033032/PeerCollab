function EmptyState({ title, description }) {
  return (
    <div className="empty-state text-center p-5">
      <h4 className="fw-bold">{title}</h4>
      <p className="text-secondary mb-0">{description}</p>
    </div>
  );
}

export default EmptyState;
