import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/books/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // Simple debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="position-relative w-100">
      <input
        type="text"
        className="form-control"
        placeholder="Search books by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-sm mt-1" style={{ zIndex: 1000 }}>
          {suggestions.map((book) => (
            <li
              key={book.id}
              className="list-group-item list-group-item-action cursor-pointer"
              onClick={() => {
                navigate(`/books/${book.id}`);
                setQuery('');
                setSuggestions([]);
              }}
            >
              <strong>{book.title}</strong> <small className="text-muted">by {book.author}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}