import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchDescription, setSearchDescription] = useState('');

  const handleChange = (event) => {
    setSearchDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchDescription);
  };

  return (
    <form className='search-bar' onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Introdu descrierea dorită..."
        value={searchDescription}
        onChange={handleChange}
        className='search-bar'
      />
      <button className='buton-cautare-locatii' type="submit">Caută</button>
    </form>
  );
}

export default SearchBar;
