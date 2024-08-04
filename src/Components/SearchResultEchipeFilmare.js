import React from 'react';

function SearchResultEchipeFilmare({ results, descriptions, onImageClick }) {
  return (
    <div>
      <ul className='lista-echipe-filmare'>
        {results.map((echipa, index) => (
          <li key={index}>
            <div className='descriere-imagine-filmare'>
              <div className='denumire-descriere'>
                <strong>{echipa.nume}</strong>:
                <p>{descriptions[echipa.nume]}</p>
              </div>
              <img className='imagine-locatie'
                src={`http://localhost:8080/filmingteam/getImageFilmare/${encodeURIComponent(echipa.nume)}`} 
                alt={`Imagine pentru ${echipa.nume}`} 
                onClick={() => onImageClick(`http://localhost:8080/filmingteam/getImageFilmare/${encodeURIComponent(echipa.nume)}`, `Imagine pentru ${echipa.nume}`)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResultEchipeFilmare;
