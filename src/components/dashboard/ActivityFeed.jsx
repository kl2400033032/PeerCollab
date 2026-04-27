function ActivityFeed({ activities = [] }) {
  if (!activities.length) {
    return <div className="text-secondary small">No recent activity yet.</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className="d-flex justify-content-between gap-3">
            <div>
              <div className="fw-semibold">{activity.description}</div>
              <div className="small text-secondary">{activity.userName} · {activity.type}</div>
            </div>
            <div className="small text-secondary text-nowrap">{new Date(activity.createdAt).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
