import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentForm from '../components/forms/CommentForm';
import ReviewForm from '../components/forms/ReviewForm';
import AlertMessage from '../components/shared/AlertMessage';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SkeletonCard from '../components/shared/SkeletonCard';
import StatusBadge from '../components/shared/StatusBadge';
import { useAuth } from '../contexts/useAuth';
import { addComment, addReview, getProjectAttachmentUrl, getProjectById } from '../services/projectService';
import { connectRealtime } from '../services/realtimeService';
import { extractApiError, validateCommentForm, validateReviewForm } from '../utils/formUtils';

function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewValues, setReviewValues] = useState({ feedback: '', rating: '' });
  const [commentValues, setCommentValues] = useState({ message: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [liveStatus, setLiveStatus] = useState('Connecting to live collaboration...');

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Project unavailable', ...extractApiError(error, 'Unable to load project details.') });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    let subscription;
    const client = connectRealtime();
    const subscribe = () => {
      setLiveStatus('Live collaboration enabled');
      subscription = client.subscribe(`/topic/projects/${id}/comments`, (message) => {
        const payload = JSON.parse(message.body);
        setProject((current) => {
          if (!current || current.comments.some((comment) => comment.id === payload.comment.id)) {
            return current;
          }
          return {
            ...current,
            comments: [...current.comments, payload.comment],
            commentCount: current.commentCount + 1,
          };
        });
      });
    };

    if (client.connected) {
      subscribe();
    } else {
      const previousOnConnect = client.onConnect;
      client.onConnect = (frame) => {
        previousOnConnect?.(frame);
        subscribe();
      };
    }

    return () => subscription?.unsubscribe();
  }, [id]);

  const canReview = useMemo(() => {
    if (!project || user.role !== 'STUDENT') {
      return false;
    }
    return project.studentEmail !== user.email && !project.reviews.some((review) => review.reviewerEmail === user.email);
  }, [project, user]);

  const canEdit = project && (user.role === 'ADMIN' || project.studentEmail === user.email);

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewValues((current) => ({ ...current, [name]: value }));
    setReviewErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setCommentValues((current) => ({ ...current, [name]: value }));
    setCommentErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateReviewForm(reviewValues);
    if (Object.keys(validationErrors).length > 0) {
      setReviewErrors(validationErrors);
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview(id, { ...reviewValues, rating: Number(reviewValues.rating) });
      setReviewValues({ feedback: '', rating: '' });
      await loadProject();
      setFeedback({ variant: 'success', title: 'Review submitted', message: 'Your peer review has been saved and the project owner has been notified.' });
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Review failed', ...extractApiError(error, 'Unable to submit review.') });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateCommentForm(commentValues);
    if (Object.keys(validationErrors).length > 0) {
      setCommentErrors(validationErrors);
      return;
    }

    setIsSubmittingComment(true);
    try {
      await addComment(id, commentValues);
      setCommentValues({ message: '' });
    } catch (error) {
      setFeedback({ variant: 'danger', title: 'Comment failed', ...extractApiError(error, 'Unable to post comment.') });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8"><SkeletonCard lines={4} compact /></div>
          <div className="col-lg-4"><SkeletonCard lines={3} compact /></div>
          <div className="col-lg-6"><SkeletonCard lines={5} compact /></div>
          <div className="col-lg-6"><SkeletonCard lines={5} compact /></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container">
        {feedback ? <AlertMessage {...feedback} /> : <LoadingSpinner message="Project unavailable." />}
      </div>
    );
  }

  return (
    <div className="container">
      {feedback ? <AlertMessage {...feedback} /> : null}
      <div className="surface-card p-4 p-md-5 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <div className="soft-label">Project Collaboration Workspace</div>
            <h1 className="page-title mb-1">{project.title}</h1>
            <p className="text-secondary mb-0">{project.studentName} · {project.studentEmail}</p>
          </div>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="filter-chip filter-chip-live">{liveStatus}</span>
            <StatusBadge status={project.status} />
            {canEdit ? <Link className="btn btn-warning text-white" to={`/projects/${project.id}/edit`}>Update</Link> : null}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="feed-card p-4 h-100">
              <h5 className="fw-bold">Description</h5>
              <p className="text-secondary mb-3">{project.description}</p>
              <div className="small text-secondary">
                <div><strong>Assignment:</strong> {project.assignmentTitle || 'Not linked'}</div>
                <div><strong>Average Rating:</strong> {project.averageRating ? project.averageRating.toFixed(1) : 'N/A'}</div>
                <div><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</div>
              </div>
              {project.attachment ? (
                <div className="attachment-panel mt-4">
                  <div className="fw-semibold">{project.attachment.fileName}</div>
                  <div className="small text-secondary">
                    {project.attachment.contentType} · {(project.attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <a className="btn btn-outline-primary btn-sm mt-3" href={getProjectAttachmentUrl(project.id)} target="_blank" rel="noreferrer">
                    Download Attachment
                  </a>
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="feed-card p-4 h-100">
              <h5 className="fw-bold">Summary</h5>
              <div className="soft-label">Reviews</div>
              <div className="stat-number">{project.reviewCount}</div>
              <div className="soft-label mt-3">Comments</div>
              <div className="stat-number">{project.commentCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="page-title fs-4 mb-0">Peer Reviews</h4>
              <span className="filter-chip">{project.reviewCount} total</span>
            </div>
            {canReview ? (
              <div className="mb-4">
                <ReviewForm values={reviewValues} errors={reviewErrors} onChange={handleReviewChange} onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
              </div>
            ) : null}
            {project.reviews.length === 0 ? (
              <EmptyState title="No reviews yet" description="Peer feedback will appear here once classmates review the submission." />
            ) : (
              <div className="d-flex flex-column gap-3">
                {project.reviews.map((review) => (
                  <div key={review.id} className="review-bubble">
                    <div className="d-flex justify-content-between gap-2">
                      <div className="fw-bold">{review.reviewerName}</div>
                      <div className="filter-chip">{review.rating}/5</div>
                    </div>
                    <div className="small text-secondary mt-1">{new Date(review.createdAt).toLocaleString()}</div>
                    <p className="mb-0 mt-2">{review.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="surface-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="page-title fs-4 mb-0">Live Discussion</h4>
              <span className="filter-chip">{project.commentCount} messages</span>
            </div>
            <div className="mb-4">
              <CommentForm values={commentValues} errors={commentErrors} onChange={handleCommentChange} onSubmit={handleCommentSubmit} isSubmitting={isSubmittingComment} />
            </div>
            {project.comments.length === 0 ? (
              <EmptyState title="No discussion yet" description="Use comments to collaborate on improvements and next steps." />
            ) : (
              <div className="d-flex flex-column gap-3">
                {project.comments.map((comment) => (
                  <div key={comment.id} className="comment-bubble">
                    <div className="fw-bold">{comment.authorName}</div>
                    <div className="small text-secondary">{new Date(comment.createdAt).toLocaleString()}</div>
                    <p className="mb-0 mt-2">{comment.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
