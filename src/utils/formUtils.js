export function extractApiError(error, fallbackMessage) {
  return {
    message: error.response?.data?.message || fallbackMessage,
    details: error.response?.data?.details || [],
  };
}

export function validateAuthForm(values, isRegister = false) {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  }
  if (!values.password?.trim()) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (isRegister) {
    if (!values.name?.trim()) {
      errors.name = 'Name is required.';
    }
    if (!values.role) {
      errors.role = 'Role is required.';
    }
  }

  return errors;
}

export function validateProjectForm(values) {
  const errors = {};
  if (!values.title?.trim()) {
    errors.title = 'Title is required.';
  }
  if (!values.description?.trim() || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  if (!values.status) {
    errors.status = 'Status is required.';
  }
  return errors;
}

export function validateReviewForm(values) {
  const errors = {};
  if (!values.feedback?.trim() || values.feedback.trim().length < 5) {
    errors.feedback = 'Feedback must be at least 5 characters.';
  }
  if (!values.rating) {
    errors.rating = 'Rating is required.';
  }
  return errors;
}

export function validateCommentForm(values) {
  const errors = {};
  if (!values.message?.trim()) {
    errors.message = 'Comment is required.';
  }
  return errors;
}

export function validateAssignmentForm(values) {
  const errors = {};
  if (!values.title?.trim()) {
    errors.title = 'Title is required.';
  }
  if (!values.description?.trim() || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  }
  if (!values.assignedStudentId) {
    errors.assignedStudentId = 'Please assign a student.';
  }
  return errors;
}
