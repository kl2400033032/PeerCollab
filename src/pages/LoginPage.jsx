import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import AuthForm from '../components/forms/AuthForm';
import AlertMessage from '../components/shared/AlertMessage';
import { extractApiError, validateAuthForm } from '../utils/formUtils';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateAuthForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Login failed', ...extractApiError(error, 'Unable to login.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card row g-0 w-100">
        <div className="col-lg-6 auth-gradient p-5 d-flex flex-column justify-content-center">
          <div className="soft-label text-white-50">Peer Review Platform</div>
          <h1 className="display-6 fw-bold mt-2">Collaborate, review, and monitor academic projects professionally.</h1>
          <p className="mt-3 mb-0">
            Sign in to access student project workflows, peer feedback, and teacher monitoring dashboards.
          </p>
        </div>
        <div className="col-lg-6 p-4 p-md-5 bg-white">
          {feedback ? <AlertMessage {...feedback} /> : null}
          <AuthForm
            title="Welcome Back"
            subtitle="Login to continue to your PeerCollab workspace."
            values={values}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Login"
            isSubmitting={isSubmitting}
          />
          <p className="text-secondary mt-4 mb-0">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
