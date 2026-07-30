import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchSuggestions from '../components/SearchSuggestions';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [filterAuthor, setFilterAuthor] = useState('');
  
  // New state for the flexible year filter
  const [filterYear, setFilterYear] = useState('');
  const [yearFilterType, setYearFilterType] = useState('before'); 

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Filter books based on author and publication year
  const filteredBooks = books.filter(book => {
    const matchesAuthor = filterAuthor === '' || book.author.toLowerCase().includes(filterAuthor.toLowerCase());
    
    let matchesYear = true;
    if (filterYear !== '') {
      const year = parseInt(filterYear);
      // If the book has a year, check it against the selected filter type
      if (book.published_year) {
        if (yearFilterType === 'before') {
          matchesYear = book.published_year <= year;
        } else if (yearFilterType === 'after') {
          matchesYear = book.published_year >= year;
        }
      } else {
        // Exclude books without a published year if a year filter is actively applied
        matchesYear = false; 
      }
    }

    return matchesAuthor && matchesYear;
  });

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    } else if (sortBy === 'year') {
      return (a.published_year || 0) - (b.published_year || 0);
    }
    return 0;
  });

  return (
    <div className="page-shell container py-4 py-md-5">
      <h1 className="page-title h2 mb-3">Book List</h1>
      <div className="mb-4 search-panel" style={{ maxWidth: '420px' }}>
        <SearchSuggestions />
      </div>

      <div className="controls-panel mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Sort By</label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="year">Published Year</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Filter by Author</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Orwell"
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Year Filter Type</label>
            <select className="form-select" value={yearFilterType} onChange={(e) => setYearFilterType(e.target.value)}>
              <option value="before">Before or In</option>
              <option value="after">After or In</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Published Year</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 1950"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ul className="book-list">
        {sortedBooks.map(book => 
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.title} by {book.author} {book.published_year ? `(${book.published_year})` : ''}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default HomePage;