import { useState } from 'react';

function AuthForm({ title, subtitle, values, errors, onChange, onSubmit, submitLabel, isSubmitting, isRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit}>
      <h2 className="fw-bold mb-2">{title}</h2>
      <p className="text-secondary mb-4">{subtitle}</p>

      {isRegister ? (
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={values.name} onChange={onChange} />
          <div className="invalid-feedback">{errors.name}</div>
        </div>
      ) : null}

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={values.email} onChange={onChange} />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <div className="input-group">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={values.password}
            onChange={onChange}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <div className="invalid-feedback">{errors.password}</div>
        </div>
      </div>

      {isRegister ? (
        <div className="mb-4">
          <label className="form-label">Role</label>
          <select name="role" className={`form-select ${errors.role ? 'is-invalid' : ''}`} value={values.role} onChange={onChange}>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin (Teacher)</option>
          </select>
          <div className="invalid-feedback">{errors.role}</div>
        </div>
      ) : null}

      <button className="btn btn-primary w-100" disabled={isSubmitting}>
        {isSubmitting ? 'Please wait...' : submitLabel}
      </button>
    </form>
  );
}

export default AuthForm;
