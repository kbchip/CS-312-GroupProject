import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
  }, [id])

  useEffect(() => {
    fetch(`/api/books/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
  }, [id])

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
          <li key={review.id}>
            {review.rating}/5 - {review.comment}
          </li>
        ))}
      </ul>

      <h2>Post a Review</h2>
      <p>TODO: Add the review form here once auth is wired up</p>
    </div>
  )
}

export default BookDetailsPage