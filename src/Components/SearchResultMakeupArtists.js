import React from 'react';

function SearchResultMakeupArtists({ results, descriptions, onImageClick }) {
  return (
    <div>
      <ul className='lista-makeup-artists'>
        {results.map((artist, index) => (
          <li key={index}>
            <div className='descriere-imagine-artist'>
              <div className='denumire-descriere'>
                <strong>{artist.nume}</strong>:
                <p>{descriptions[artist.nume]}</p>
              </div>
              <img className='imagine-locatie'
                src={`http://localhost:8080/makeupartists/getImageArtist/${encodeURIComponent(artist.nume)}`} 
                alt={`Imagine pentru ${artist.nume}`} 
                onClick={() => onImageClick(`http://localhost:8080/makeupartists/getImageArtist/${encodeURIComponent(artist.nume)}`, `Imagine pentru ${artist.nume}`)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResultMakeupArtists;
