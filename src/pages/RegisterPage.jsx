import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import AuthForm from '../components/forms/AuthForm';
import AlertMessage from '../components/shared/AlertMessage';
import { extractApiError, validateAuthForm } from '../utils/formUtils';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
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
    const validationErrors = validateAuthForm(values, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Registration failed', ...extractApiError(error, 'Unable to register.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card row g-0 w-100">
        <div className="col-lg-6 auth-gradient p-5 d-flex flex-column justify-content-center">
          <div className="soft-label text-white-50">Final Year Submission Ready</div>
          <h1 className="display-6 fw-bold mt-2">Create your PeerCollab account and start managing academic collaboration.</h1>
          <p className="mt-3 mb-0">
            Students can submit projects and review peers. Teachers can create assignments and monitor progress.
          </p>
        </div>
        <div className="col-lg-6 p-4 p-md-5 bg-white">
          {feedback ? <AlertMessage {...feedback} /> : null}
          <AuthForm
            title="Create Account"
            subtitle="Register as a student or teacher to access the platform."
            values={values}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Register"
            isSubmitting={isSubmitting}
            isRegister
          />
          <p className="text-secondary mt-4 mb-0">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
