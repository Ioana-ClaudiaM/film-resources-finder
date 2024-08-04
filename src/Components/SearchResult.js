import React from 'react';

function SearchResult({ results, descriptions, type }) {
  return (
    <div className={`search-results search-results-${type}`}>
      <ul>
        {results.map((item, index) => (
          <li key={index} className="result-item">
            <div className="result-content">
              <strong>{item}</strong>:
              <p>{descriptions[item]}</p>
              <img src={`http://localhost:8080/${type}/getImage/${encodeURIComponent(item)}`} alt={`Imagine pentru ${item}`} className="result-image"/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResult;
