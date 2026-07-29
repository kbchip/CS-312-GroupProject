import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function BookDetailsPage({ user }) {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewComment, setReviewComment] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editComment, setEditComment] = useState('')
  const [editRating, setEditRating] = useState(5)
  const [editError, setEditError] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState(null)

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
  }, [id])

  const loadReviews = useCallback(async () => {
    const response = await fetch(`/api/books/${id}/reviews`, {
      credentials: 'include',
    })
    return response.json()
  }, [id])

  useEffect(() => {
    loadReviews()
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
  }, [loadReviews])

  const handleReviewSubmit = async (event) => {
    event.preventDefault()

    if (!user) {
      setSubmitError('Please sign in to post a review.')
      return
    }

    if (!reviewComment.trim()) {
      setSubmitError('Please add a review comment.')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const response = await fetch(`/api/books/${id}/reviews`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Unable to post review.')
      }

      setReviewComment('')
      setReviewRating(5)
      await loadReviews()
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditingReview = (review) => {
    setEditingReviewId(review.id)
    setEditComment(review.comment)
    setEditRating(review.rating)
    setEditError('')
  }

  const cancelEditingReview = () => {
    setEditingReviewId(null)
    setEditComment('')
    setEditRating(5)
    setEditError('')
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (!editingReviewId) {
      return
    }

    if (!editComment.trim()) {
      setEditError('Please add a review comment.')
      return
    }

    try {
      setIsSavingEdit(true)
      setEditError('')

      const response = await fetch(`/api/books/${id}/reviews/${editingReviewId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: editRating,
          comment: editComment.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Unable to update review.')
      }

      await loadReviews()
      cancelEditingReview()
    } catch (error) {
      setEditError(error.message)
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) {
      return
    }

    try {
      setDeletingReviewId(reviewId)
      const response = await fetch(`/api/books/${id}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Unable to delete review.')
      }

      if (editingReviewId === reviewId) {
        cancelEditingReview()
      }

      await loadReviews()
    } catch (error) {
      setEditError(error.message)
    } finally {
      setDeletingReviewId(null)
    }
  }

  const renderStars = (rating, onSelect, disabled = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isSelected = starValue <= rating

      return (
        <button
          key={starValue}
          type="button"
          className={`btn btn-sm ${isSelected ? 'btn-warning' : 'btn-outline-secondary'} me-1`}
          onClick={() => onSelect(starValue)}
          disabled={disabled}
          aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
        >
          {isSelected ? '★' : '☆'}
        </button>
      )
    })
  }

  // allow initial render with null values (before API fetch)
  if (!book) return (<p>Loading...</p>)

  return (
    <div>
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      <p>{book.description}</p>

      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <strong>{review.username || 'Anonymous'}</strong>
              <span>{renderStars(review.rating, () => {}, true)}</span>
              <span className="text-muted">{review.rating}/5</span>
            </div>
            {editingReviewId === review.id ? (
              <form onSubmit={handleEditSubmit} className="d-grid gap-3 mt-2" style={{ maxWidth: '42rem' }}>
                <div>
                  <label className="form-label d-block">Rating</label>
                  <div>{renderStars(editRating, setEditRating)}</div>
                </div>

                <div>
                  <label htmlFor={`edit-comment-${review.id}`} className="form-label">
                    Review
                  </label>
                  <textarea
                    id={`edit-comment-${review.id}`}
                    className="form-control"
                    rows="4"
                    value={editComment}
                    onChange={(event) => setEditComment(event.target.value)}
                  />
                </div>

                {editError ? <p className="text-danger mb-0">{editError}</p> : null}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isSavingEdit}>
                    {isSavingEdit ? 'Saving...' : 'Save changes'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={cancelEditingReview}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="mb-2">{review.comment}</p>
                {user?.id === review.user_id ? (
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEditingReview(review)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                    >
                      {deletingReviewId === review.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Post a Review</h2>
      {!user ? <p className="text-muted">Sign in to enable review posting.</p> : null}
      <form onSubmit={handleReviewSubmit} className="d-grid gap-3" style={{ maxWidth: '42rem' }}>
        <div>
          <label className="form-label d-block">Rating</label>
          <div>{renderStars(reviewRating, setReviewRating, !user)}</div>
        </div>

        <div>
          <label htmlFor="reviewComment" className="form-label">Review</label>
          <textarea
            id="reviewComment"
            className="form-control"
            rows="4"
            value={reviewComment}
            onChange={(event) => setReviewComment(event.target.value)}
            placeholder={user ? 'Write what you thought about the book...' : 'Sign in to write a review...'}
            disabled={!user}
          />
        </div>

        {submitError ? <p className="text-danger mb-0">{submitError}</p> : null}

        <div>
          <button type="submit" className="btn btn-primary" disabled={!user || isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookDetailsPage