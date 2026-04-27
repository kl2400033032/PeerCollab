import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/forms/ProjectForm';
import AlertMessage from '../components/shared/AlertMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAuth } from '../contexts/useAuth';
import { getMyAssignments } from '../services/assignmentService';
import { createProject, getProjectById, updateProject, uploadProjectAttachment } from '../services/projectService';
import { extractApiError, validateProjectForm } from '../utils/formUtils';

const initialValues = { title: '', description: '', status: 'SUBMITTED', assignmentId: '' };

function ProjectFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user.role === 'STUDENT') {
          setAssignments(await getMyAssignments());
        }

        if (mode === 'edit') {
          const project = await getProjectById(id);
          setValues({
            title: project.title,
            description: project.description,
            status: project.status,
            assignmentId: project.assignmentId || '',
          });
        }
      } catch (error) {
        setFeedback({ variant: 'danger', title: 'Unable to load form', ...extractApiError(error, 'Project form could not be prepared.') });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, mode, user.role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setErrors((current) => ({ ...current, file: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateProjectForm(values);
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      validationErrors.file = 'File must be 10 MB or less.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...values, assignmentId: values.assignmentId ? Number(values.assignmentId) : null };
      const result = mode === 'edit' ? await updateProject(id, payload) : await createProject(payload);
      if (selectedFile) {
        await uploadProjectAttachment(result.id, selectedFile);
      }
      navigate(`/projects/${result.id}`);
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Save failed', ...extractApiError(error, 'Project could not be saved.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading project form..." />;
  }

  return (
    <div className="container">
      <div className="surface-card p-4 p-md-5">
        <h1 className="page-title mb-2">{mode === 'edit' ? 'Update Project' : 'Add Project'}</h1>
        <p className="text-secondary mb-4">
          {mode === 'edit'
            ? 'Revise your submission, attach files, and keep the review workflow moving.'
            : 'Create a polished submission with optional PDF or ZIP upload for peer review.'}
        </p>
        {feedback ? <AlertMessage {...feedback} /> : null}
        <ProjectForm
          values={values}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          selectedFileName={selectedFile?.name}
          assignments={assignments}
          submitLabel={mode === 'edit' ? 'Save Changes' : 'Create Project'}
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/projects')}
        />
      </div>
    </div>
  );
}

export default ProjectFormPage;
