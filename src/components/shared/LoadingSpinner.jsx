function LoadingSpinner({ message = 'Loading...', fullPage = false }) {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center ${fullPage ? 'min-vh-100' : 'py-5'}`}>
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 mb-0 text-secondary">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
