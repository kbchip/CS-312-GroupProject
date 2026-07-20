import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [count, setCount] = useState(0);
  const [books, setBooks] = useState([]);

  useEffect(() => {
  fetch('/api/books')
    .then((res) => res.json())
    .then((data) => setBooks(data))
    .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
  <div>
    <h2>Book List</h2>
    <ul>
      {books.map(book => 
        <li key={book.id}>
          <Link to={`/books/${book.id}`}>
            {book.title} by {book.author}
          </Link>
        </li>
      )}
    </ul>
  </div>
  )
}

export default HomePage