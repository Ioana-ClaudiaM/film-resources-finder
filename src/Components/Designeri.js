import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResultDesigneri from './SearchResultDesigneri';

function Designeri({ userId, onImageClick }) {
  const [searchResults, setSearchResults] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const searchTerms = description.split(' ');
      const matches = {};

      await Promise.all(searchTerms.map(async (term) => {
        try {
          const response = await fetch(`http://localhost:8080/designers/searchDesigner?term=${term}`);
          const designeri = await response.json();
          designeri.forEach(designer => {
            if (!matches[designer.nume]) {
              matches[designer.nume] = {
                matches: 0,
                description: designer.descriere,
                matchesByTerm: {},
                id: designer.id
              };
            }
            matches[designer.nume].description = designer.descriere;
            matches[designer.nume].matchesByTerm[term] = (matches[designer.nume].matchesByTerm[term] || 0) + 1;
          });
        } catch (error) {
          console.error('Eroare la căutare:', error);
        }
      }));

      const sortedDesigners = Object.keys(matches).sort((a, b) => {
        const totalMatchesA = Object.values(matches[a].matchesByTerm).reduce((acc, val) => acc + val, 0);
        const totalMatchesB = Object.values(matches[b].matchesByTerm).reduce((acc, val) => acc + val, 0);
        return totalMatchesB - totalMatchesA;
      });

      setSearchResults(sortedDesigners.filter(designer => {
        return Object.values(matches[designer].matchesByTerm).some(matchCount => matchCount > 0);
      }).map(designer => ({ nume: designer, id: matches[designer].id })));

      setDescriptions(Object.fromEntries(sortedDesigners.map(designer => [designer, matches[designer].description])));
    } catch (error) {
      console.error('Eroare la căutare:', error);
      setError('Eroare la căutare. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className='header-designeri'>Designeri de costume</h1>
      <h1 className='paragraf-designeri'>Introduceți în bara de căutare o descriere succintă în ceea ce privește preferințele dumneavoastră pentru
        designerii de costume, iar ulterior vă va fi generată o listă cu designeri în concordanță cu criteriile introduse.
      </h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResultDesigneri results={searchResults} descriptions={descriptions} onImageClick={onImageClick} />
    </div>
  );
}

export default Designeri;
