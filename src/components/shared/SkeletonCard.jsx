function SkeletonCard({ lines = 3, compact = false }) {
  return (
    <div className={`surface-card p-4 ${compact ? 'h-100' : ''}`}>
      <div className="skeleton-block skeleton-title mb-3" />
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-block ${index === lines - 1 ? 'skeleton-line-short' : 'skeleton-line'} ${index < lines - 1 ? 'mb-2' : ''}`}
        />
      ))}
    </div>
  );
}

export default SkeletonCard;
