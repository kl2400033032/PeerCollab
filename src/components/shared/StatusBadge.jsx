function StatusBadge({ status }) {
  return <span className={`status-pill ${status}`}>{status.replace('_', ' ')}</span>;
}

export default StatusBadge;
