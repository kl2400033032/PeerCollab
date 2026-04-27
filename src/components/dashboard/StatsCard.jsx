function StatsCard({ title, value, accent = 'primary' }) {
  return (
    <div className="stat-card p-4 h-100">
      <div className="soft-label">{title}</div>
      <div className={`stat-number text-${accent}`}>{value}</div>
    </div>
  );
}

export default StatsCard;
