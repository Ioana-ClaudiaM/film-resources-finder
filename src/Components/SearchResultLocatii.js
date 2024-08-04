import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function SearchResultLocatii({ results, descriptions, onImageClick, saveLocation, userId }) {
  const [savedItems, setSavedItems] = useState([]);

  const handleSave = (locationId) => {
    saveLocation(userId, locationId);
    if (savedItems.includes(locationId)) {
      setSavedItems(savedItems.filter(id => id !== locationId));
    } else {
      setSavedItems([...savedItems, locationId]);
    }
  };

  return (
    <div>
      <ul className='lista-locatii'>
        {results.map((location, index) => (
          <li key={index}>
            <div className='descriere-imagine-locatie'>
              <div className='denumire-descriere'>
                <strong>{location.nume}</strong>:
                <p>{descriptions[location.nume]}</p>
              </div>
              <img className='image-preview'
                src={`http://localhost:8080/locations/getImageLocation/${encodeURIComponent(location.nume)}`} 
                alt={`Imagine pentru ${location.nume}`} 
                onClick={() => onImageClick(`http://localhost:8080/locations/getImageLocation/${encodeURIComponent(location.nume)}`, `Imagine pentru ${location.nume}`)}
              />
            </div>
            <IconButton onClick={() => handleSave(location.id)}>
                {savedItems.includes(location.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResultLocatii;
