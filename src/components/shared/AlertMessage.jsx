function AlertMessage({ variant = 'info', title, message, details = [] }) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {title ? <div className="fw-bold mb-1">{title}</div> : null}
      {message ? <div>{message}</div> : null}
      {details.length > 0 ? (
        <ul className="mb-0 mt-2 ps-3">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default AlertMessage;
