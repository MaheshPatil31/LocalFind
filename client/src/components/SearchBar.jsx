import React from 'react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="sr-only" htmlFor="business-search">Search LocalFind</label>
      <input
        id="business-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What service are you looking for?"
      />
      <button type="submit">Search</button>
    </form>
  );
}
