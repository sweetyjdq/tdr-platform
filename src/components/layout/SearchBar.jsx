import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const pages = [
  { label: 'Government Dashboard', path: '/' },
  { label: 'e-TDR Services',       path: '/services' },
  { label: 'Upload Certificate',   path: '/services' },
  { label: 'Issue TDR',            path: '/services' },
  { label: 'Transfer TDR',         path: '/services' },
  { label: 'Blockchain Verification', path: '/verification' },
  { label: 'Profile',              path: '/profile' },
  { label: 'Register User',        path: '/register' },
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = pages.filter(p => p.label.toLowerCase().includes(val.toLowerCase()));
      setResults(filtered);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="search-container">
      <Search size={15} className={`search-icon ${focused ? 'active' : ''}`} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search pages, services..."
        className={`search-input ${focused ? 'focused' : ''}`}
      />
      {query && (
        <button className="search-clear" onClick={() => { setQuery(''); setOpen(false); }}>
          <X size={14} />
        </button>
      )}
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((r, i) => (
            <div key={i} className="search-item" onClick={() => handleSelect(r.path)}>
              <Search size={13} />
              {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
