import React from 'react';

function SearchResultDesigneri({ results, descriptions, onImageClick }) {
  return (
    <div>
      <ul className='lista-designeri'>
        {results.map((designer, index) => (
          <li key={index}>
            <div className='descriere-imagine-designer'>
              <div className='denumire-descriere'>
                <strong>{designer.nume}</strong>:
                <p>{descriptions[designer.nume]}</p>
              </div>
              <img className='imagine-locatie'
                src={`http://localhost:8080/designers/getImageDesigner/${encodeURIComponent(designer.nume)}`} 
                alt={`Imagine pentru ${designer.nume}`} 
                onClick={() => onImageClick(`http://localhost:8080/designers/getImageDesigner/${encodeURIComponent(designer.nume)}`, `Imagine pentru ${designer.nume}`)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResultDesigneri;
